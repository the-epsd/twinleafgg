import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { CoinFlipPrompt, ConfirmPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class GlimwoodTangle extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '166';
  public trainerType = TrainerType.STADIUM;
  public set = 'DAA';
  public name = 'Glimwood Tangle';
  public fullName = 'Glimwood Tangle DAA';

  public text = 'Once during each player\'s turn, after that player flips any coins for an attack, they may ignore all results of those coin flips and begin flipping those coins again.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle both coin flip effects and prompts when this stadium is in play
    if (StateUtils.getStadiumCard(state) === this) {
      if (effect instanceof CoinFlipEffect) {
        const playerId = effect.player.id;
        return this.handleCoinFlip(store, state, playerId);
      }

      if (effect instanceof CoinFlipPrompt) {
        const playerId = effect.playerId;
        return this.handleCoinFlip(store, state, playerId);
      }
    }
    return state;
  }

  private handleCoinFlip(store: StoreLike, state: State, playerId: number): State {
    // First ask if they want to reflip
    return store.prompt(state, new ConfirmPrompt(
      playerId,
      GameMessage.WANT_TO_USE_ABILITY
    ), wantToReflip => {
      if (wantToReflip) {
        // If they want to reflip, do a new coin flip
        return store.prompt(state, [
          new CoinFlipPrompt(playerId, GameMessage.FLIP_COIN)
        ], result => {
          // The new result will replace the previous one
          return state;
        });
      } else {
        // If they don't want to reflip, let the original result stand
        return state;
      }
    });
  }
}
