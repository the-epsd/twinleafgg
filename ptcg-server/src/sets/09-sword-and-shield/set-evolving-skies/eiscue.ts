import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Eiscue extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Icy Snow',
    cost: [W],
    damage: 20,
    text: ''
  }, {
    name: 'Blockface',
    cost: [W, C, C],
    damage: 70,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  }];

  public regulationMark: string = 'E';
  public set: string = 'EVS';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Eiscue';
  public fullName: string = 'Eiscue EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Blockface
    if (WAS_ATTACK_USED(effect, 1, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    return state;
  }
}
