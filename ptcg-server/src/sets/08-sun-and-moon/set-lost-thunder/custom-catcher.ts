import {
  ConfirmPrompt,
  GameError,
  GameMessage,
  Player,
  State,
  StateUtils,
  StoreLike,
  TrainerCard,
} from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  DRAW_CARDS,
  GUST_OPPONENT_BENCHED_POKEMON,
  MOVE_CARDS,
} from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class CustomCatcher extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'LOT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '171';
  public name: string = 'Custom Catcher';
  public fullName: string = 'Custom Catcher LOT';
  public text: string = `You may play 2 Custom Catcher cards at once.

  • If you played 1 card, draw cards until you have 3 cards in your hand.
  • If you played 2 cards, switch 1 of your opponent's Benched Pokémon with their Active Pokémon. (This effect works one time for 2 cards.)`;

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    const opponent = StateUtils.getOpponent(state, player);
    const otherCards = player.hand.cards.filter((c) => c !== this);
    const canDraw = player.deck.cards.length > 0 && otherCards.length < 3;
    const canPlayBoth =
      otherCards.some((c) => c.name === this.name) &&
      opponent.bench.some((b) => b.cards.length > 0);
    return canDraw || canPlayBoth;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const second = player.hand.cards.find((c) => c.name === this.name && c !== this);
      const opponentHasBench = opponent.bench.some((b) => b.cards.length > 0);

      // If you played 1 card, draw cards until you have 3 cards in your hand.
      const drawUpToThree = (): boolean => {
        const cardsToDraw = Math.max(0, 3 - player.hand.cards.filter((c) => c !== this).length);
        if (cardsToDraw === 0 || player.deck.cards.length === 0) {
          return false;
        }
        DRAW_CARDS(store, state, player, cardsToDraw);
        return true;
      };

      // If you played 2 cards, switch 1 of your opponent's Benched Pokémon with their Active Pokémon.
      if (second !== undefined && opponentHasBench) {
        return store.prompt(
          state,
          new ConfirmPrompt(player.id, GameMessage.WANT_TO_PLAY_BOTH_CARDS_AT_ONCE),
          (wantToUse) => {
            if (wantToUse) {
              MOVE_CARDS(store, state, player.hand, player.discard, {
                cards: [second],
                sourceCard: this,
              });
              GUST_OPPONENT_BENCHED_POKEMON(store, state, player);
            } else {
              drawUpToThree();
            }
          },
        );
      }

      if (!drawUpToThree()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    return state;
  }
}
