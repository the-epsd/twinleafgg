import { Effect } from '../../../game/store/effects/effect';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { State } from '../../../game/store/state/state';
import { Player } from '../../../game/store/state/player';
import { StoreLike } from '../../../game/store/store-like';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { TrainerType } from '../../../game/store/card/card-types';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { DRAW_CARDS, MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class PalaceBook extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'NAN25';
  public name: string = 'Palace Book';
  public fullName: string = 'Palace Book SMP';
  public text: string = 'Draw 3 cards. Your turn ends.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.deck.cards.length === 0) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, { cards: [effect.trainerCard], sourceCard: this });
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      DRAW_CARDS(store, state, player, 3);

      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
    }

    return state;
  }
}
