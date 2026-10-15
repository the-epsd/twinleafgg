import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GET_CARDS_ON_BOTTOM_OF_DECK, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +10 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Down Draw',
    cost: [C],
    damage: 0,
    text: 'Draw a card from the bottom of your deck.'
  },
  {
    name: 'Mud Spatter',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Diglett';
  public fullName: string = 'Diglett SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Down Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const bottomCards = GET_CARDS_ON_BOTTOM_OF_DECK(player, 1);
      if (bottomCards.length > 0) {
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: bottomCards, sourceCard: this });
      }
    }

    return state;
  }
}
