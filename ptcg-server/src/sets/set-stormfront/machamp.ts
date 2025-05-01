import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';

export class Machamp extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Machoke';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P, value: 30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Take Out',
      cost: [F],
      damage: 40,
      text: 'If the Defending Pokémon isn\'t an Evolved Pokémon, that Pokémon is Knocked Out instead of damaged by this attack.',
    },
    {
      name: 'Hurricane Punch',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 4 coins. This attack does 30 damage times the number of heads.',
    },
    {
      name: 'Rage',
      cost: [F, F, C, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Does 60 damage plus 10 more damage for each damage counter on Machamp.',
    },
  ];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Machamp';
  public fullName: string = 'Machamp SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Take Out
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.getPokemons().length > 1) {
        return state;
      }
      effect.damage = 0

      const dealDamage = new KnockOutOpponentEffect(effect, 999);
      dealDamage.target = opponent.active;
      store.reduceEffect(state, dealDamage);
    }

    // Hurricane Punch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 4, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 30 * heads;
      });
    }

    // Rage
    if (WAS_ATTACK_USED(effect, 2, this)) {
      effect.damage += effect.player.active.damage;
    }

    return state;
  }
}