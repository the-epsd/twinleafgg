import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #47 — Play Rough */
export class Pikachu47 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Play Rough',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 more damage.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '47';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 47';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Play Rough
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 20);
    }
    return state;
  }
}
