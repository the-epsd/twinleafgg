import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  StateUtils,
  GameMessage,
  CardList,
  ChooseCardsPrompt,
  GameError,
  Player,
} from '../../../game';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Riley extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '166';
  public name: string = 'Riley';
  public fullName: string = 'Riley LOR 166';
  public text: string =
    'Reveal the top 5 cards of your deck and have your opponent choose 2 of them. Discard the chosen cards and put the remaining cards into your hand. You may play only 1 Supporter card during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
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
      const opponent = StateUtils.getOpponent(state, player);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [this], sourceCard: this });

      // Draw top 5 cards
      const deckTop = new CardList();
      const count = Math.min(5, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, deckTop, { count: count, sourceCard: this });

      // Show the top 5 cards to opponent
      SHOW_CARDS_TO_PLAYER(store, state, opponent, deckTop.cards);

      // Opponent chooses 2 to discard
      const chooseCount = Math.min(2, deckTop.cards.length);
      if (chooseCount === 0) {
        // All cards go to hand
        MOVE_CARDS(store, state, deckTop, player.hand, { sourceCard: this });
        MOVE_CARDS(store, state, player.supporter, player.discard, {
          cards: [this],
          sourceCard: this,
        });
        return state;
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          opponent,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          deckTop,
          {},
          { min: chooseCount, max: chooseCount, allowCancel: false },
        ),
        (selected) => {
          const discarded = selected || [];
          // Discard chosen cards
          MOVE_CARDS(store, state, deckTop, player.discard, {
            cards: discarded,
            sourceCard: this,
          });
          // Rest go to hand
          MOVE_CARDS(store, state, deckTop, player.hand, { sourceCard: this });
          MOVE_CARDS(store, state, player.supporter, player.discard, {
            cards: [this],
            sourceCard: this,
          });
        },
      );
    }

    return state;
  }
}
