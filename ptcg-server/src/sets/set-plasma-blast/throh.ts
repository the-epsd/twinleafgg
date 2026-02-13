import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Throh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Freestyle Strike',
      cost: [F, C],
      damage: 30,
      damageCalculation: 'x' as const,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Shoulder Throw',
      cost: [F, C, C],
      damage: 80,
      damageCalculation: '-' as const,
      text: 'Does 80 damage minus 20 damage for each Colorless in the Defending Pok\u00e9mon\'s Retreat Cost.'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '51';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Throh';
  public fullName: string = 'Throh PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const checkRetreat = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreat);
      const retreatCost = checkRetreat.cost.length;
      effect.damage -= 20 * retreatCost;
    }

    return state;
  }
}
