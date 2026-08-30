import { PokemonCard, Stage, CardType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public cardType: CardType[] = [D];
  public hp: number = 170;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Queen Press',
    cost: [D, C],
    damage: 90,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  },
  {
    name: 'Lunge Out',
    cost: [D, D, C],
    damage: 160,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    return state;
  }
}
