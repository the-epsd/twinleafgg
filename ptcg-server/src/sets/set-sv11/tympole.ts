import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
// Energy type constants (W, C, L) are assumed to be globally available as in other SV11B cards

export class Tympole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Round',
    cost: [C, C],
    damage: 20,
    text: 'This attack does 20 damage for each of your Pokémon in play that has the Round attack.'
  }];

  public regulationMark = 'I';
  public set: string = 'SV11B';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack effect would be implemented here if needed
    return state;
  }
} 