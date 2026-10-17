import { TrainerType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  StoreLike,
  State,
  GameMessage,
  CardList,
  ChooseCardsPrompt,
  StateUtils,
  Player,
} from '../../../game';
import {
  SHUFFLE_DECK,
  MOVE_CARDS,
  SHOW_CARDS_TO_PLAYER,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ToolBox extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '168';
  public name: string = 'Tool Box';
  public fullName: string = 'Tool Box LOR 168';
  public text: string =
    'Look at the top 7 cards of your deck. You may reveal any number of Pokémon Tool cards you find there and put them into your hand. Shuffle the other cards back into your deck. You may play any number of Item cards during your turn.';

  public canPlay(_store: StoreLike, _state: State, _player: Player): boolean {
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      effect.preventDefault = true;

      const deckTop = new CardList();
      const count = Math.min(7, player.deck.cards.length);
      MOVE_CARDS(store, state, player.deck, deckTop, { count: count, sourceCard: this });

      // Find Tool cards in top 7 and build blocked array for non-Tool cards
      const blocked: number[] = [];
      deckTop.cards.forEach((card, index) => {
        const isTool = card instanceof TrainerCard && card.trainerType === TrainerType.TOOL;
        if (!isTool) {
          blocked.push(index);
        }
      });

      const toolCards = deckTop.cards.filter(
        (c) => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL,
      );

      if (toolCards.length === 0) {
        // No Tool cards found, shuffle all cards back into deck
        MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this });
        return SHUFFLE_DECK(store, state, player);
      }

      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_HAND,
          deckTop,
          { superType: SuperType.TRAINER },
          { min: 0, max: toolCards.length, allowCancel: false, blocked },
        ),
        (selected) => {
          const cards = selected || [];

          if (cards.length > 0) {
            // Reveal selected Tool cards to opponent
            MOVE_CARDS(store, state, deckTop, player.hand, { cards: cards, sourceCard: this });

            SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          }

          // Shuffle remaining cards back into deck
          MOVE_CARDS(store, state, deckTop, player.deck, { sourceCard: this });
          SHUFFLE_DECK(store, state, player);
        },
      );
    }

    return state;
  }
}
