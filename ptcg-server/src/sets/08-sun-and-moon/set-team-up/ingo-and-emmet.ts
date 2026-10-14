import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  State,
  StoreLike,
  TrainerCard,
  GameError,
  GameMessage,
  Player,
  SelectOptionPrompt,
} from '../../../game';
import { DRAW_CARDS, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class IngoAndEmmet extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '144';
  public name: string = 'Ingo & Emmet';
  public fullName: string = 'Ingo & Emmet TEU';
  public text: string =
    'Look at the top card of your deck, and then choose 1:\n' +
    '\n- Discard your hand and draw 5 cards.' +
    '\n- Discard your hand and draw 5 cards from the bottom of your deck.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Look at the top card of your deck
      SHOW_CARDS_TO_PLAYER(store, state, player, [player.deck.cards[0]]);

      return store.prompt(
        state,
        new SelectOptionPrompt(
          player.id,
          GameMessage.CHOOSE_OPTION,
          [
            'Discard your hand and draw 5 cards.',
            'Discard your hand and draw 5 cards from the bottom of your deck.',
          ],
          {
            allowCancel: false,
            defaultValue: 0,
          },
        ),
        (choice) => {
          const cards = player.hand.cards.filter((c) => c !== this);
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.hand, player.discard, { cards });
          }

          if (choice === 0) {
            DRAW_CARDS(store, state, player, 5);
          } else if (choice === 1) {
            const bottomCards = player.deck.cards.slice(-5);
            MOVE_CARDS(store, state, player.deck, player.hand, { cards: bottomCards });
          }
        },
      );
    }

    return state;
  }
}
