import { State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magneton extends PokemonCard {

  public set = 'BS';

  public fullName = 'Magneton BS';

  public name = 'Magneton';

  public cardType: CardType = CardType.LIGHTNING;

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Magnemite';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '9';

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Thunder Wave',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Selfdestruct',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 80,
      text: 'Does 20 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magneton does 80 damage to itself.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Damage opponent's bench
      opponent.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 20);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });

      // Damage player's bench
      player.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 20);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });

      // Damage self
      const dealDamage = new DealDamageEffect(effect, 80);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }

}
