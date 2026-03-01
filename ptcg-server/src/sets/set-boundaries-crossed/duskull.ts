import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Duskull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [P],
    damage: 0,
    text: 'The Defending Pokemon is now Confused.'
  }];

  public set: string = 'BCR';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Duskull';
  public fullName: string = 'Duskull BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Confuse Ray
    // Ref: set-boundaries-crossed/vileplume.ts (Pollen Spray)
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }
    return state;
  }
}
