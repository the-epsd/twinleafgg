import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { Player, StoreLike, State, GameMessage, ChooseCardsPrompt } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Kamado extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'F';
  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Kamado';
  public fullName: string = 'Kamado ASR 149';
  public text: string =
    "Choose a card in your hand, and discard the other cards. If you do, draw 4 cards. (If you have no other cards in your hand, you can't use this card.) You may play only 1 Supporter card during your turn.";

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const otherCards = player.hand.cards.filter((c) => c !== this);
    if (otherCards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      // Must have other cards (not just Kamado) to use this card
      // After move to supporter, check remaining hand cards
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });
      effect.preventDefault = true;

      if (player.hand.cards.length === 0) {
        // No other cards in hand - can't use
        MOVE_CARDS(store, state, player.supporter, player.hand, {
          cards: [effect.trainerCard],
          sourceCard: this,
        });
        effect.preventDefault = false;
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Player chooses 1 card from hand to keep
      return store.prompt(
        state,
        new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARDS,
          player.hand,
          {},
          { min: 1, max: 1, allowCancel: false },
        ),
        (selected) => {
          const keptCard = selected && selected.length > 0 ? selected[0] : undefined;
          if (!keptCard) {
            return;
          }

          // Discard all other cards from hand
          const cardsToDiscard = player.hand.cards.filter((c) => c !== keptCard);
          cardsToDiscard.forEach((card) => {
            MOVE_CARDS(store, state, player.hand, player.discard, { cards: [card], sourceCard: this });
          });

          // Draw 4 cards
          DRAW_CARDS(store, state, player, 4);
        },
      );
    }

    return state;
  }
}
