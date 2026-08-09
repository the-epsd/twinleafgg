import { StoreLike } from '../store-like';

/** Keep in sync with ptcg-play-react BOARD_DECK_SHUFFLE_SERVER_WAIT_MS / SHUFFLE_DURATION. */
export const DECK_SHUFFLE_ANIMATION_WAIT_MS = 650;

/**
 * Notify clients to play the 3D deck shuffle animation for {@link playerId}.
 * Mirrors {@link emitCoinFlipAnimation} socket pattern.
 */
export function emitDeckShuffleAnimation(store: StoreLike, playerId: number): void {
  const game = (store as any).handler;
  if (game?.core && typeof game.core.emit === 'function') {
    game.core.emit((c: any) => {
      if (typeof c.socket !== 'undefined') {
        c.socket.emit(`game[${game.id}]:deckShuffle`, {
          playerId,
        });
      }
    });
  }
}

/** Fisher–Yates permutation of indices `[0 .. length)`. */
export function fisherYatesOrder(length: number): number[] {
  const order: number[] = [];
  for (let i = 0; i < length; i++) {
    order.push(i);
  }
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return order;
}
