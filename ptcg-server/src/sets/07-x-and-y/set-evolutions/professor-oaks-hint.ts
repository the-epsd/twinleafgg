import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, Player, State, StoreLike } from '../../../game';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class ProfessorOaksHint extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'EVO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = "Professor Oak's Hint";
  public fullName: string = "Professor Oak's Hint EVO";
  public text: string =
    'Draw cards until you have 7 cards in your hand. Your turn ends. You may play only 1 Supporter card during your turn (before your attack).';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 7);

      store.reduceEffect(state, new EndTurnEffect(player));
    }

    return state;
  }
}
