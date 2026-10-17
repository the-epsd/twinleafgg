import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  ChooseCardsPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ReturnLabel extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '153';
  public name: string = 'Return Label';
  public fullName: string = 'Return Label TEU';
  public text: string = "Put a card from your opponent's discard pile on the bottom of their deck.";

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    // Opponent needs a card in their discard pile
    return opponent.discard.cards.length > 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.discard.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DECK,
          opponent.discard,
          {},
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, opponent.discard, opponent.deck, {
              cards: [cards[0]],
              sourceCard: this,
            });
            // Moved cards are placed at the top, so move it to the bottom
            const card = opponent.deck.cards.shift();
            if (card) {
              opponent.deck.cards.push(card);
            }
          }
        },
      );
    }

    return state;
  }
}
