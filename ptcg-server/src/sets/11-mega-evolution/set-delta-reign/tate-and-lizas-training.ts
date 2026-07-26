import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { DRAW_CARDS } from '../../../game/store/prefabs/prefabs';

export class TateAndLizasTraining extends TrainerCard {
  public trainerType: TrainerType = TrainerType.SUPPORTER;
  public regulationMark: string = 'J';
  public set: string = 'M6';
  public setNumber: string = '70';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tate & Liza\'s Training';
  public fullName: string = 'Tate & Liza\'s Training M6';
  public text: string = 'Draw 2 cards. Then, if there is a Stadium in play with "Legendary" in its name, put this card back into your hand instead of discarding it.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      effect.preventDefault = true;

      DRAW_CARDS(store, state, player, 2);

      const stadium = StateUtils.getStadiumCard(state);
      if (stadium && stadium.name.includes('Legendary')) {
        player.supporter.moveCardTo(effect.trainerCard, player.hand);
      } else {
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
      }
    }

    return state;
  }
}
