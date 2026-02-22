import { GameMessage, GameLog } from '../../game/game-message';
import { StateUtils } from '../../game/store/state-utils';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { ConfirmPrompt } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { WaitPrompt } from '../../game/store/prompts/wait-prompt';
import { REMOVE_MARKER_AT_END_OF_TURN, ADD_MARKER, HAS_MARKER } from '../../game/store/prefabs/prefabs';

export class GlimwoodTangle extends TrainerCard {
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '162';
  public trainerType = TrainerType.STADIUM;
  public set = 'DAA';
  public name = 'Glimwood Tangle';
  public fullName = 'Glimwood Tangle DAA';

  public readonly GLIMWOOD_REFLIP_USED = 'GLIMWOOD_REFLIP_USED';

  public text = 'Once during each player\'s turn, after that player flips any coins for an attack, they may ignore all results of those coin flips and begin flipping those coins again.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Remove once-per-turn marker at end of turn
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.GLIMWOOD_REFLIP_USED, this);

    if (effect instanceof CoinFlipEffect && state.phase === GamePhase.ATTACK && StateUtils.getStadiumCard(state) === this && !effect.skipReflipStadium) {
      // Check for marker to prevent multiple reflips
      if (HAS_MARKER(this.GLIMWOOD_REFLIP_USED, effect.player, this)) {
        return state;
      }

      effect.preventDefault = true;

      const result = Math.random() < 0.5;
      (effect as CoinFlipEffect).result = result;
      const player = (effect as CoinFlipEffect).player;
      const coinFlipEffect = effect as CoinFlipEffect;
      const stateForCallback = state;

      // Emit coin flip animation (same as gameReducer)
      const game = (store as any).handler;
      if (game && game.core && typeof game.core.emit === 'function') {
        game.core.emit((c: any) => {
          if (typeof c.socket !== 'undefined') {
            c.socket.emit(`game[${game.id}]:coinFlip`, {
              playerId: player.id,
              result: result
            });
          }
        });
      }

      return store.prompt(state, new WaitPrompt(player.id, 2000, 'Coin flip animation'), () => {
        store.log(stateForCallback, result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS, { name: player.name });
        store.prompt(stateForCallback, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), wantToReflip => {
          if (!wantToReflip) {
            if (coinFlipEffect.callback) {
              coinFlipEffect.callback(result);
            }
          } else {
            store.log(stateForCallback, GameLog.LOG_PLAYER_REFLIPS_WITH_GLIMWOOD_TANGLE, { name: player.name });
            ADD_MARKER(this.GLIMWOOD_REFLIP_USED, player, this);
            const reflipEffect = new CoinFlipEffect(player, coinFlipEffect.callback);
            reflipEffect.skipReflipStadium = true;
            store.reduceEffect(stateForCallback, reflipEffect);
          }
        });
      });
    }

    return state;
  }
}
