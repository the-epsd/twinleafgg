import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';

export class SkyPillar extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;

  public regulationMark = 'D';

  public set: string = 'CES';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public name: string = 'Sky Pillar';

  public fullName: string = 'Sky Pillar CES';

  public text: string = 'Prevent all effects of the opponent\'s attacks, including damage, done to Benched Pokémon (both yours and your opponent\'s).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      throw new GameError(GameMessage.CANNOT_USE_STADIUM);
    }

    if (effect instanceof PutDamageEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    
    if (effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}