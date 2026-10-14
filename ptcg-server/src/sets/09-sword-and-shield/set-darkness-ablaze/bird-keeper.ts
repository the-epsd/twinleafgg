import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { Effect } from '../../../game/store/effects/effect';
import { GameError, GameMessage, Player } from '../../../game';
import { DRAW_CARDS, MOVE_CARDS, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class BirdKeeper extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark = 'D';
  public set: string = 'DAA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '159';
  public name: string = 'Bird Keeper';
  public fullName: string = 'Bird Keeper DAA';
  public text: string =
    'Switch your Active Pokemon with 1 of your Benched Pokemon. If you do, draw 3 cards.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    const hasBench = player.bench.some((b) => b.cards.length > 0);
    if (!hasBench) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;
      const hasBench = player.bench.some((b) => b.cards.length > 0);

      if (hasBench === false) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Do not discard the card yet
      effect.preventDefault = true;

      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      DRAW_CARDS(store, state, player, 3);
    }

    return state;
  }
}
