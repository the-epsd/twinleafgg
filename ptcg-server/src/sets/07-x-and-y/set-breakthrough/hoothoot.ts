import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Hoothoot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Proclaim the Night',
    cost: [C, C],
    damage: 0,
    text: 'Your opponent can\'t play any Item cards from his or her hand during his or her next turn.'
  }];

  public set: string = 'BKT';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hoothoot';
  public fullName: string = 'Hoothoot BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Proclaim the Night
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }

    return state;
  }
}
