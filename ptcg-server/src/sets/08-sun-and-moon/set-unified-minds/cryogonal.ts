import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Cryogonal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Frozen Lock',
    cost: [W],
    damage: 10,
    text: 'Your opponent can\'t play any Item cards from their hand during their next turn.'
  }];

  public set = 'UNM';
  public setNumber = '46';
  public cardImage = 'assets/cardback.png';
  public name = 'Cryogonal';
  public fullName = 'Cryogonal UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frozen Lock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }
    return state;
  }
}
