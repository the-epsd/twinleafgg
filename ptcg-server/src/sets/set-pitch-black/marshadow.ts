import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Marshadow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Shadow Knot',
    cost: [P],
    damage: 30,
    damageCalculation: 'x',
    text: 'This attack does 30 damage times the number of [C] in your opponent\'s Active Pokémon\'s Retreat Cost.',
  }];

  public set: string = 'M5';
  public setNumber: string = '38';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Marshadow';
  public fullName: string = 'Marshadow M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-unbroken-bonds/krookodile.ts (Chomp Chomp Panic)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const checkRetreat = new CheckRetreatCostEffect(opponent);
      store.reduceEffect(state, checkRetreat);
      const colorlessCount = checkRetreat.cost.filter(c => c === CardType.COLORLESS).length;

      effect.damage = 30 * colorlessCount;
    }

    return state;
  }
}
