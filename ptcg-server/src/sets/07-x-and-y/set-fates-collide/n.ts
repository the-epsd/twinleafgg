import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, StateUtils } from '../../../game';
import { MOVE_CARDS, SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class N extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '105';
  public name: string = 'N';
  public fullName: string = 'N FCO';
  public text: string =
    'Each player shuffles his or her hand into his or her deck. Then, each player draws a card for each of his or her remaining Prize cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (
      player.hand.cards.filter((c) => c !== this).length === 0 &&
      player.deck.cards.length === 0
    ) {
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

      if (
        player.hand.cards.filter((c) => c !== this).length === 0 &&
        player.deck.cards.length === 0
      ) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        sourceCard: this,
        drawCount: player.getPrizeLeft(),
        afterDraw: () => {
          SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, opponent, {
            sourceCard: this,
            drawCount: opponent.getPrizeLeft(),
          });
        },
      });
    }

    return state;
  }
}
