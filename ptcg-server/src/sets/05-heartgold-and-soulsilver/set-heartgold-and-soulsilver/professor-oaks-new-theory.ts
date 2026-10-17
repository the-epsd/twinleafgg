import { TrainerType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, Player, State, StoreLike, TrainerCard } from '../../../game';
import { SHUFFLE_HAND_INTO_DECK_THEN_DRAW } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorOaksNewTheory extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'HS';
  public name: string = "Professor Oak's New Theory";
  public fullName: string = 'Professor Oaks New Theory HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public text: string = 'Shuffle your hand into your deck. Then, draw 6 cards.';

  public canPlay(_store: StoreLike, _state: State, player: Player): boolean {
    return player.supporterTurn === 0;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      return SHUFFLE_HAND_INTO_DECK_THEN_DRAW(store, state, player, {
        excludeCard: this,
        drawCount: 6,
        sourceCard: this,
      });
    }

    return state;
  }
}
