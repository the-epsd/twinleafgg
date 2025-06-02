import { GameMessage, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';

export class Magnemite extends PokemonCard {

  public cardType: CardType = L;

  public stage: Stage = Stage.BASIC;

  public hp: number = 40;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Thunder Wave',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Selfdestruct',
      cost: [L, C],
      damage: 40,
      text: 'Does 10 damage to each Pokémon on each player\'s Bench. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Magnemite does 40 damage to itself.'
    }
  ];

  public set = 'BS';

  public fullName = 'Magnemite BS';

  public name = 'Magnemite';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialCondition);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Damage opponent's bench
      opponent.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 10);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });

      // Damage player's bench
      player.bench.forEach(benchPokemon => {
        const dealDamage = new DealDamageEffect(effect, 10);
        dealDamage.target = benchPokemon;
        store.reduceEffect(state, dealDamage);
      });

      // Damage self
      const dealDamage = new DealDamageEffect(effect, 40);
      dealDamage.target = player.active;
      store.reduceEffect(state, dealDamage);
    }

    return state;
  }

}
