import type { LocalGameState } from './types/localGameState';

/** Enter: hidden → flipping (Angular `hidden => flipping`). */
export const COIN_FLIP_ENTER_DURATION_SEC = 0.3;

/** Delay before spin starts (Angular `setTimeout(..., 1000)` while in flipping state). */
export const COIN_FLIP_SPIN_DELAY_SEC = 1.0;

/** Spin: flipping → heads/tails (Angular `animate('1s linear', keyframes(...))`). */
export const COIN_FLIP_SPIN_DURATION_SEC = 1.0;

/** Total visible time before hide sequence (Angular `setTimeout(..., 5500)`). */
export const COIN_FLIP_TOTAL_VISIBLE_MS = 5500;

/** Gap between result-text hide and coin hide (Angular `setTimeout(..., 200)`). */
export const COIN_FLIP_RESULT_TEXT_HIDE_MS = 200;

/** Exit: * → hidden (Angular `animate('0.3s ease-in', ...)`). */
export const COIN_FLIP_EXIT_DURATION_SEC = 0.3;

/** Server WaitPrompt — keep in sync with ptcg-server attack-coin-reflip.ts */
export const COIN_FLIP_SERVER_WAIT_MS = 2000;

export type CoinFlipSpinKeyframe = {
  rotXDeg: number;
  rotYDeg: number;
  scale: number;
  offset: number;
};

/** Angular keyframes for `flipping => heads` / `flipping => tails`. */
export function getCoinFlipSpinKeyframes(isHeads: boolean): CoinFlipSpinKeyframe[] {
  if (isHeads) {
    return [
      { rotXDeg: 0, rotYDeg: 0, scale: 1, offset: 0 },
      { rotXDeg: 240, rotYDeg: 45, scale: 1.6, offset: 0.1 },
      { rotXDeg: 480, rotYDeg: -30, scale: 2, offset: 0.6 },
      { rotXDeg: 720, rotYDeg: 0, scale: 1, offset: 1 },
    ];
  }
  return [
    { rotXDeg: 0, rotYDeg: 0, scale: 1, offset: 0 },
    { rotXDeg: 300, rotYDeg: 45, scale: 1.6, offset: 0.1 },
    { rotXDeg: 600, rotYDeg: -30, scale: 2, offset: 0.6 },
    { rotXDeg: 900, rotYDeg: 0, scale: 1, offset: 1 },
  ];
}

/** Mirror Angular board.component meaningful-state cancel rules. */
export function shouldCancelCoinFlipAnimation(
  previousState: LocalGameState,
  currentState: LocalGameState,
): boolean {
  const previousPrompts =
    previousState.state?.prompts?.filter((p) => p.result === undefined) ?? [];
  const currentPrompts =
    currentState.state?.prompts?.filter((p) => p.result === undefined) ?? [];

  // Server adds a WaitPrompt while the coin animation plays — not a meaningful cancel.
  const onlyCoinFlipWaitAdded =
    currentPrompts.length === previousPrompts.length + 1 &&
    currentPrompts.some(
      (p) =>
        p.type === 'WaitPrompt' &&
        (p as { message?: string }).message === 'Coin flip animation' &&
        !previousPrompts.some((prev) => prev.id === p.id),
    ) &&
    currentPrompts.filter((p) => p.type !== 'WaitPrompt').length ===
      previousPrompts.filter((p) => p.type !== 'WaitPrompt').length;
  if (onlyCoinFlipWaitAdded) {
    return false;
  }

  const differentGame = previousState.localId !== currentState.localId;
  const activePlayerChanged =
    previousState.state?.activePlayer !== currentState.state?.activePlayer;

  if (differentGame || activePlayerChanged) {
    return true;
  }

  const previousNonWaitPrompts = previousPrompts.filter((p) => p.type !== 'WaitPrompt');
  const currentNonWaitPrompts = currentPrompts.filter((p) => p.type !== 'WaitPrompt');
  const newNonWaitPrompt =
    currentNonWaitPrompts.length > previousNonWaitPrompts.length ||
    currentNonWaitPrompts.some(
      (p) => !previousNonWaitPrompts.find((prev) => prev.id === p.id),
    );

  const promptsCleared =
    previousPrompts.length > 0 &&
    currentPrompts.length === 0 &&
    previousPrompts.some((p) => p.type !== 'WaitPrompt');

  if (onlyCoinFlipWaitAdded) {
    return false;
  }

  return newNonWaitPrompt || promptsCleared;
}
