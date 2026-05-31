import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];
  public evolvesFrom = 'Nidoran ♀';

  public attacks = [
    {
      name: 'Supersonic',
      cost: [G],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.',
    },
    {
      name: 'Double Kick',
      cost: [C, C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.',
    },
  ];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(
        state,
        [new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)],
        (results) => {
          if (results) {
            const specialConditionEffect = new AddSpecialConditionsEffect(effect, [
              SpecialCondition.CONFUSED,
            ]);
            store.reduceEffect(state, specialConditionEffect);
          }
        },
      );
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = store.prompt(
        state,
        [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        ],
        (results) => {
          let heads: number = 0;
          results.forEach((r) => {
            heads += r ? 1 : 0;
          });
          effect.damage = 30 * heads;
        },
      );
      return state;
    }

    return state;
  }
}
