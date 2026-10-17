import { GameError, GameMessage, Player, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AceTrainer extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Ace Trainer';
  public fullName: string = 'Ace Trainer AOR';
  public text: string =
    'You can play this card only if you have more Prize cards left than your opponent.\n\nEach player shuffles his or her hand into his or her deck. Then, draw 6 cards. Your opponent draws 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const opponent = StateUtils.getOpponent(state, player);
    if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
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

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (
        player.hand.cards.filter((c) => c !== this).length === 0 &&
        player.deck.cards.length === 0
      ) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        sourceCard: this,
        drawCount: 6,
        afterDraw: () => {
          SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, opponent, {
            sourceCard: this,
            drawCount: 3,
          });
        },
      });
    }

    return state;
  }
}
