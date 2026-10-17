import { Effect } from '../../../game/store/effects/effect';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { GameError, GameMessage, Player } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Lillie extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '125';
  public name: string = 'Lillie';
  public fullName: string = 'Lillie UPR';
  public text: string =
    "Draw cards until you have 6 cards in your hand. If it's your first turn, draw cards until you have 8 cards in your hand.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const targetHandSize = state.turn <= 2 ? 8 : 6;
    const handSize = player.hand.cards.filter((c) => c !== this).length;
    return handSize < targetHandSize && player.deck.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (!this.canPlay(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move Lillie out of the hand so it isn't counted toward the hand size
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const targetHandSize = state.turn <= 2 ? 8 : 6;
      DRAW_CARDS(store, state, player, targetHandSize - player.hand.cards.length);
    }

    return state;
  }
}
