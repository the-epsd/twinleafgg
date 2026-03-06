import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from "../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Continuous Spin',
    cost: [F],
    damage: 30,
    damageCalculation: 'x' as 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Baltoy';
  public fullName: string = 'Baltoy M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 30);
    }
    return state;
  }
}
