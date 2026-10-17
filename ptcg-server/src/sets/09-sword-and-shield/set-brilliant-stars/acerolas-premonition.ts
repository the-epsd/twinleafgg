import { GameMessage } from '../../../game/game-message';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { StateUtils } from '../../../game/store/state-utils';
import { GameError, Player } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS, SHOW_CARDS_TO_PLAYER } from '../../../game/store/prefabs/prefabs';
import { CLEAN_UP_SUPPORTER, WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class AcerolasPremonition extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'E';
  public set: string = 'BRS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = "Acerola's Premonition";
  public fullName: string = "Acerola's Premonition BRS";
  public text: string =
    'Your opponent reveals their hand, and you draw a card for each Trainer card you find there.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
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

      effect.preventDefault = true;
      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      const trainersInOpponentHand = opponent.hand.cards.filter((c) => c instanceof TrainerCard);

      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);
      DRAW_CARDS(store, state, player, trainersInOpponentHand.length);
      CLEAN_UP_SUPPORTER(store, effect, player);
    }

    return state;
  }
}
