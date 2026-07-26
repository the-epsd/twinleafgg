import { GameLog, GameMessage } from '../../game-message';
import { CoinFlipEffect, CoinFlipSequenceEffect } from '../effects/play-card-effects';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { Effect } from '../effects/effect';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { Player } from '../state/player';
import { WaitPrompt } from '../prompts/wait-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';

/** Shared once-per-turn marker for attack coin re-flip effects (Glimwood Tangle, Backtrack Badge, Trick Coin, etc.). */
export const COIN_REFLIP_AGAIN_USED = 'COIN_REFLIP_AGAIN_USED';

export type AttackCoinReflipSource = 'stadium' | 'tool';

export interface AttackCoinReflipConfig {
  source: AttackCoinReflipSource;
  canOffer: (store: StoreLike, state: State, player: Player) => boolean;
  reflipLog: GameLog;
}

const COIN_FLIP_ANIMATION_WAIT_MS = 2000;

function shouldSkipReflipSource(
  effect: CoinFlipEffect | CoinFlipSequenceEffect,
  source: AttackCoinReflipSource,
): boolean {
  if (source === 'stadium' && effect.skipReflipStadium) {
    return true;
  }
  if (source === 'tool' && effect.skipReflipTool) {
    return true;
  }
  return false;
}

function emitCoinFlipAnimation(store: StoreLike, player: Player, result: boolean): void {
  const game = (store as any).handler;
  if (game?.core && typeof game.core.emit === 'function') {
    game.core.emit((c: any) => {
      if (typeof c.socket !== 'undefined') {
        c.socket.emit(`game[${game.id}]:coinFlip`, {
          playerId: player.id,
          result,
        });
      }
    });
  }
}

function markReflipUsed(player: Player): void {
  player.marker.addMarkerToState(COIN_REFLIP_AGAIN_USED);
}

function offerAttackCoinReflip(
  store: StoreLike,
  state: State,
  player: Player,
  config: AttackCoinReflipConfig,
  onDecline: () => void,
  onAccept: () => void,
): void {
  store.prompt(state, new ConfirmPrompt(player.id, GameMessage.WANT_TO_USE_ABILITY), wantToReflip => {
    if (!wantToReflip) {
      onDecline();
      return;
    }
    store.log(state, config.reflipLog, { name: player.name });
    markReflipUsed(player);
    onAccept();
  });
}

export function CLEAR_COIN_REFLIP_AGAIN_AT_END_OF_TURN(effect: Effect): void {
  if (effect instanceof EndTurnEffect) {
    effect.player.marker.removeMarker(COIN_REFLIP_AGAIN_USED);
  }
}

/** Default coin flip resolution used by gameReducer when no card intercepts. */
export function RESOLVE_COIN_FLIP_EFFECT(store: StoreLike, state: State, effect: CoinFlipEffect): State {
  const result = Math.random() < 0.5;
  effect.result = result;
  const player = effect.player;
  const stateForCallback = state;

  emitCoinFlipAnimation(store, player, result);

  return store.prompt(state, new WaitPrompt(player.id, COIN_FLIP_ANIMATION_WAIT_MS, 'Coin flip animation'), () => {
    store.log(
      stateForCallback,
      result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS,
      { name: player.name },
    );
    effect.callback?.(result);
  });
}

/** Runs a coin flip sequence, optionally offering a one-time attack re-flip when complete. */
export function RUN_COIN_FLIP_SEQUENCE(
  store: StoreLike,
  state: State,
  seqEffect: CoinFlipSequenceEffect,
  config?: AttackCoinReflipConfig,
): State {
  const player = seqEffect.player;

  const doOneFlip = (s: State, resultsSoFar: boolean[], onDone: (results: boolean[]) => void): State => {
    const coinFlip = new CoinFlipEffect(player, (flipResult: boolean) => {
      const newResults = [...resultsSoFar, flipResult];
      if (seqEffect.mode === 'untilTails' && flipResult) {
        doOneFlip(s, newResults, onDone);
      } else if (seqEffect.mode === 'untilTails' && !flipResult) {
        onDone(newResults);
      } else if (typeof seqEffect.mode === 'number' && newResults.length < seqEffect.mode) {
        doOneFlip(s, newResults, onDone);
      } else {
        onDone(newResults);
      }
    });
    coinFlip.skipReflipStadium = true;
    coinFlip.skipReflipTool = true;
    return store.reduceEffect(s, coinFlip);
  };

  const finish = (results: boolean[]) => {
    if (
      config &&
      state.phase === GamePhase.ATTACK &&
      !player.marker.hasMarker(COIN_REFLIP_AGAIN_USED) &&
      config.canOffer(store, state, player)
    ) {
      offerAttackCoinReflip(
        store,
        state,
        player,
        config,
        () => seqEffect.callback(results),
        () => {
          const reflipSequence = new CoinFlipSequenceEffect(player, seqEffect.mode, seqEffect.callback);
          reflipSequence.skipReflipStadium = true;
          reflipSequence.skipReflipTool = true;
          store.reduceEffect(state, reflipSequence);
        },
      );
    } else {
      seqEffect.callback(results);
    }
  };

  return doOneFlip(state, [], finish);
}

function resolveAttackCoinFlipWithReflipOption(
  store: StoreLike,
  state: State,
  effect: CoinFlipEffect,
  config: AttackCoinReflipConfig,
): State {
  effect.preventDefault = true;
  const result = Math.random() < 0.5;
  effect.result = result;
  const player = effect.player;
  const stateForCallback = state;

  emitCoinFlipAnimation(store, player, result);

  return store.prompt(state, new WaitPrompt(player.id, COIN_FLIP_ANIMATION_WAIT_MS, 'Coin flip animation'), () => {
    store.log(
      stateForCallback,
      result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS,
      { name: player.name },
    );
    offerAttackCoinReflip(
      store,
      stateForCallback,
      player,
      config,
      () => effect.callback?.(result),
      () => {
        const reflip = new CoinFlipEffect(player, effect.callback);
        reflip.skipReflipStadium = true;
        reflip.skipReflipTool = true;
        store.reduceEffect(stateForCallback, reflip);
      },
    );
  });
}

/** Card reduceEffect helper for stadium/tool attack coin re-flip effects. */
export function ATTACK_COIN_REFLIP_REDUCE_EFFECT(
  store: StoreLike,
  state: State,
  effect: Effect,
  config: AttackCoinReflipConfig,
): State {
  CLEAR_COIN_REFLIP_AGAIN_AT_END_OF_TURN(effect);

  if (effect instanceof CoinFlipEffect) {
    if (shouldSkipReflipSource(effect, config.source)) {
      return state;
    }
    if (state.phase !== GamePhase.ATTACK) {
      return state;
    }
    if (effect.player.marker.hasMarker(COIN_REFLIP_AGAIN_USED)) {
      return state;
    }
    if (!config.canOffer(store, state, effect.player)) {
      return state;
    }
    return resolveAttackCoinFlipWithReflipOption(store, state, effect, config);
  }

  if (effect instanceof CoinFlipSequenceEffect) {
    if (shouldSkipReflipSource(effect, config.source)) {
      return state;
    }
    if (state.phase !== GamePhase.ATTACK) {
      return state;
    }
    if (effect.player.marker.hasMarker(COIN_REFLIP_AGAIN_USED)) {
      return state;
    }
    if (!config.canOffer(store, state, effect.player)) {
      return state;
    }
    effect.preventDefault = true;
    return RUN_COIN_FLIP_SEQUENCE(store, state, effect, config);
  }

  return state;
}
