import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { DRAW_CARDS, MOVE_CARD_TO, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';
import { CardList, SelectOptionPrompt } from '../../game';

export class IngoAndEmmet extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public name: string = 'Ingo & Emmet';
  public fullName: string = 'Ingo & Emmet TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';

  public text: string =
    'Look at the top card of your deck, and then choose 1:\n' +
    '\n- Discard your hand and draw 5 cards.' +
    '\n- Discard your hand and draw 5 cards from the bottom of your deck.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {

      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARD_TO(state, effect.trainerCard, player.supporter);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 1);
      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);
      deckTop.moveTo(player.deck, 0);
      player.deck.cards = deckTop.cards.concat(player.deck.cards);

      state = store.prompt(state, new SelectOptionPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        [
          'Discard your hand and draw 5 cards.',
          'Discard your hand and draw 5 cards from the bottom of your deck.'
        ],
        {
          allowCancel: false,
          defaultValue: 0
        }
      ), choice => {
        if (choice === 0) {
          // Option 1
          MOVE_CARDS(store, state, player.hand, player.discard);
          DRAW_CARDS(player, 5);

        } else if (choice === 1) {
          // Option 2
          MOVE_CARDS(store, state, player.hand, player.discard);
          const bottomCards = player.deck.cards.slice(-5);
          player.deck.moveCardsTo(bottomCards, player.hand);
        }
      });

      MOVE_CARD_TO(state, effect.trainerCard, player.discard);
    }

    return state;
  }

}
