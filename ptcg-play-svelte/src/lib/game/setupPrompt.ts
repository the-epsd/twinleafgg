import type { PlayerView } from './types';

export type SetupPromptUiState = {
  minSelections: number;
  maxSelections: number;
  hasEngineActive: boolean;
  needsActive: boolean;
  canConfirm: boolean;
  benchCapacity: number;
};

export function promptLimit(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function getSetupPromptUiState(
  options: unknown,
  player: PlayerView | undefined,
  pendingActiveIndex: number | null,
): SetupPromptUiState {
  const promptOptions = options && typeof options === 'object' ? (options as Record<string, unknown>) : {};
  const minSelections = promptLimit(promptOptions.min, 1);
  const maxSelections = promptLimit(promptOptions.max, 6);
  const hasEngineActive = !!player && !player.active.empty;
  const needsActive = !hasEngineActive && minSelections > 0;
  return {
    minSelections,
    maxSelections,
    hasEngineActive,
    needsActive,
    canConfirm: hasEngineActive || pendingActiveIndex !== null || minSelections === 0,
    benchCapacity: hasEngineActive ? maxSelections : Math.max(0, maxSelections - 1),
  };
}

export function setupPromptResult(
  hasEngineActive: boolean,
  pendingActiveIndex: number | null,
  pendingBenchIndexes: number[],
): number[] {
  return hasEngineActive || pendingActiveIndex === null
    ? pendingBenchIndexes
    : [pendingActiveIndex, ...pendingBenchIndexes];
}
