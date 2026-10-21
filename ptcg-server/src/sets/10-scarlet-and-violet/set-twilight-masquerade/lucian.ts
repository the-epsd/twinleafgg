import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { Card, GameError, GameMessage, Player, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';
import { COIN_FLIP_PROMPT, DRAW_CARDS, MOVE_HAND_TO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';

export class Lucian extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '157';
  public name: string = 'Lucian';
  public fullName: string = 'Lucian TWM';
  public text: string =
    'Each player shuffles their hand and puts it on the bottom of their deck. If either player put any cards on the bottom of their deck in this way, each player flips a coin. If heads, that player draws 6 cards. If tails, they draw 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const opponent = StateUtils.getOpponent(state, player);
    const playerCards = player.hand.cards.filter((c) => c !== this).length;
    const opponentCards = opponent.hand.cards.length;

    if (playerCards === 0 && player.deck.cards.length === 0) {
      return false;
    }
    if (playerCards === 0 && opponentCards === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      const playerCards = player.hand.cards.filter((c) => c !== this);
      const opponentCards = [...opponent.hand.cards];

      if (playerCards.length === 0 && player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      if (playerCards.length === 0 && opponentCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      this.shuffleCards(playerCards);
      this.shuffleCards(opponentCards);

      const eitherPutCards = playerCards.length > 0 || opponentCards.length > 0;

      const flipAndDraw = (target: Player, afterDraw?: () => void) => {
        if (!eitherPutCards) {
          afterDraw?.();
          return;
        }
        COIN_FLIP_PROMPT(store, state, target, (heads) => {
          DRAW_CARDS(store, state, target, heads ? 6 : 3);
          afterDraw?.();
        });
      };

      const runOpponent = (): void => {
        if (opponentCards.length > 0) {
          MOVE_HAND_TO_DECK_THEN_DRAW(store, state, opponent, {
            cards: opponentCards,
            drawCount: 0,
            sourceCard: this,
            afterDraw: () => flipAndDraw(opponent),
            onMovePrevented: () => flipAndDraw(opponent),
          });
          return;
        }
        if (playerCards.length > 0) {
          flipAndDraw(opponent);
        }
      };

      if (playerCards.length > 0) {
        return MOVE_HAND_TO_DECK_THEN_DRAW(store, state, player, {
          cards: playerCards,
          drawCount: 0,
          sourceCard: this,
          afterDraw: () => {
            flipAndDraw(player, () => runOpponent());
          },
        });
      }

      return MOVE_HAND_TO_DECK_THEN_DRAW(store, state, opponent, {
        cards: opponentCards,
        drawCount: 0,
        sourceCard: this,
        afterDraw: () => {
          flipAndDraw(opponent, () => flipAndDraw(player));
        },
        // Opponent put was blocked and player had no cards — no coin flips.
      });
    }

    return state;
  }

  private shuffleCards(cards: Card[]): void {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}
