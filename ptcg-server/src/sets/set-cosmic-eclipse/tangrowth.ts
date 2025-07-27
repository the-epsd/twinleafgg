import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { State, StoreLike, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Tangrowth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tangela';
  public cardType: CardType = G;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Grass Knot',
    cost: [G],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each [C] in your opponent\'s Active Pokémon\'s Retreat Cost.'
  },
  {
    name: 'Slam',
    cost: [G, C, C],
    damage: 80,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 80 damage for each heads.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Tangrowth';
  public fullName: string = 'Tangrowth CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive) {
        const checkRetreatCostEffect = new CheckRetreatCostEffect(opponent);
        store.reduceEffect(state, checkRetreatCostEffect);
        const retreatCost = checkRetreatCostEffect.cost.length;

        effect.damage += retreatCost * 30;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });
        effect.damage = 80 * heads;
      });
    }

    return state;
  }
}