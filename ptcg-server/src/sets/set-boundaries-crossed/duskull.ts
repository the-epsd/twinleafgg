import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game';


export class Duskull extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 50;

  public weakness = [{ type: CardType.DARK }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'The Defending Pokemon is now Confused.'
  }];

  public set: string = 'BCR';

  public name: string = 'Duskull';

  public fullName: string = 'Duskull BCR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }
    return state;
  }

}
