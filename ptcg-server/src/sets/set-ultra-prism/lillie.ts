import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';

export class Lillie extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'UPR';

  public name: string = 'Lillie';

  public fullName: string = 'Lillie UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '125';

  public text: string =
    'Draw cards until you have 6 cards in your hand. If it\'s your first turn, draw cards until you have 8 cards in your hand.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const targetHandSize = state.turn <= 2 ? 8 : 6;

      if (player.hand.cards.length >= targetHandSize || player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      while (player.hand.cards.length < targetHandSize && player.deck.cards.length > 0) {
        player.deck.moveTo(player.hand, 1);
        if (player.deck.cards.length === 0) {
          break;
        }
      }

      player.supporter.moveCardTo(effect.trainerCard, player.discard);

    }

    return state;
  }
}