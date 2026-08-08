import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from "../../../game/store/prefabs/attack-effects";
import { WAS_ATTACK_USED, OPPONENT_CANNOT_EVOLVE_POKEMON } from "../../../game/store/prefabs/prefabs";

export class Banette2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Shuppet';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Evolution Jammer',
    cost: [P],
    damage: 20,
    text: 'Your opponent can\'t play any Pokémon from his or her hand to evolve his or her Pokémon during his or her next turn.'
  },
  {
    name: 'Curse Deeply',
    cost: [P, C],
    damage: 0,
    text: 'Put 5 damage counters on your opponent\'s Active Pokémon.'
  }];

  public set: string = 'ROS';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Banette';
  public fullName: string = 'Banette ROS 32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolution Jammer
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_EVOLVE_POKEMON(store, state, effect, this);
    }
    // Curse Deeply
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(5, store, state, effect);
    }

    return state;
  }
}
