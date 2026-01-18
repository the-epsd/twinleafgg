import { PokemonCard, Stage, CardType, StoreLike, State } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from "../../game/store/prefabs/costs";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Probopass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nosepass';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Avalanche',
    cost: [F, F],
    damage: 60,
    text: ''
  },
  {
    name: 'Nose Bumper',
    cost: [F, F, F, C],
    damage: 260,
    text: 'Discard 3 Energy from this Pokemon.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
  public name: string = 'Probopass';
  public fullName: string = 'Probopass M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nose Bumper - discard 3 Energy from this Pokemon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 3);
    }

    return state;
  }
}
