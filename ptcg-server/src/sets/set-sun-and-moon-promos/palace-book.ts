import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class PalaceBook extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public set: string = 'SMP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = 'NAN25';

  public name: string = 'Palace Book';

  public fullName: string = 'Palace Book SMP';

  public text: string =
    'Draw 3 cards. Your turn ends.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.deck.moveTo(player.hand, 3);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    return state;
  }

}
