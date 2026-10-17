import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  TrainerCard,
  CardList,
  ChoosePrizePrompt,
  GameError,
  GameMessage,
  Player,
  StoreLike,
  State,
} from '../../../game';
import { SHOW_CARDS_TO_PLAYER, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ArcPhone extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public regulationMark: string = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '152';
  public name: string = 'Arc Phone';
  public fullName: string = 'Arc Phone LOR 152';
  public text: string =
    'Look at the top card of your deck. You may switch that card with 1 of your face-down Prize cards. (The cards stay face down.) You may play any number of Item cards during your turn.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Look at the top card of your deck. You may switch that card with 1 of your face-down Prize cards.
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Move top card to temp area to look at it
      const deckTop = new CardList();
      MOVE_CARDS(store, state, player.deck, deckTop, { count: 1, sourceCard: this });

      const faceDownPrizes = player.prizes.filter((p) => p.isSecret && p.cards.length > 0);

      if (faceDownPrizes.length === 0) {
        // No face-down prizes to swap — show top card and return it to deck top
        SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);
        deckTop.moveToTopOfDestination(player.deck);
        return state;
      }

      // Show the player the top card
      SHOW_CARDS_TO_PLAYER(store, state, player, deckTop.cards);

      // Build blocked list from face-down prizes (only face-down, non-empty slots are selectable)
      const blocked: number[] = [];
      player.prizes.forEach((p, index) => {
        if (!p.isSecret || p.cards.length === 0) {
          blocked.push(index);
        }
      });

      // Reveal face-down prizes to the player temporarily for selection
      faceDownPrizes.forEach((p) => {
        p.isSecret = false;
      });

      return store.prompt(
        state,
        new ChoosePrizePrompt(player.id, GameMessage.CHOOSE_PRIZE_CARD, {
          count: 1,
          blocked,
          allowCancel: true,
        }),
        (chosenPrize) => {
          // Restore prizes to face-down
          faceDownPrizes.forEach((p) => {
            p.isSecret = true;
          });

          if (!chosenPrize || chosenPrize.length === 0) {
            // No swap — return top card to deck top
            deckTop.moveToTopOfDestination(player.deck);
            return;
          }

          // Swap: put chosen prize card on deck top, put deck card into chosen prize slot
          const prizeSlot = chosenPrize[0];
          const deckCard = deckTop.cards[0];

          // Move prize card to deck top via temp list
          const prizeTemp = new CardList();
          MOVE_CARDS(store, state, prizeSlot, prizeTemp, { sourceCard: this });
          prizeTemp.moveToTopOfDestination(player.deck);
          // Move deck card to prize slot
          MOVE_CARDS(store, state, deckTop, prizeSlot, { cards: [deckCard], sourceCard: this });
        },
      );
    }

    return state;
  }
}
