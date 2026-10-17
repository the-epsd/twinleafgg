import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Bicycle extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'PLS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public name: string = 'Bicycle';
  public fullName: string = 'Bicycle PLS';
  public text: string = 'Draw cards until you have 4 cards in your hand.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const cards = player.hand.cards.filter((c) => c !== this);
    const cardsToDraw = Math.max(0, 4 - cards.length);
    if (cardsToDraw === 0 || player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const cards = player.hand.cards.filter((c) => c !== this);
      const cardsToDraw = Math.max(0, 4 - cards.length);

      if (cardsToDraw === 0 || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      DRAW_CARDS(store, state, player, cardsToDraw);
    }

    return state;
  }
}
