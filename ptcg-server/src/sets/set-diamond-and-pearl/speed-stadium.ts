import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { UseStadiumEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS } from '../../game/store/prefabs/prefabs';

export class SpeedStadium extends TrainerCard {

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public trainerType = TrainerType.STADIUM;
  public set = 'DP';
  public name = 'Speed Stadium';
  public fullName = 'Speed Stadium DP';

  public text = 'Once during each player\'s turn, the player may flip a coin until he or she gets tails. For each heads, that player draws a card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          DRAW_CARDS(player, 1);
          return this.reduceEffect(store, state, effect);
        }
      });
    }
    return state;
  }
}