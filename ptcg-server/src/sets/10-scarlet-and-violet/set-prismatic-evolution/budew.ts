import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ITEM_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Budew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 30;
  public weakness = [{ type: R }];
  public retreat = [];

  public attacks = [{
    name: 'Itchy Pollen',
    cost: [],
    damage: 10,
    text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.',
  }];

  public regulationMark = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Budew';
  public fullName: string = 'Budew PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Itchy Pollen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_ITEM_CARDS(store, state, effect, this);
    }
    return state;
  }
}
