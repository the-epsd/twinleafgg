import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorSycamore extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name: string = 'Professor Sycamore';
  public fullName: string = 'Professor Sycamore XY';
  public legacyFullName: string = 'Professor Sycamore XY 122';
  public text: string = 'Discard your hand and draw 7 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return player.deck.cards.length > 0;
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

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        drawCount: 7,
        sourceCard: this,
      });
    }

    return state;
  }
}
