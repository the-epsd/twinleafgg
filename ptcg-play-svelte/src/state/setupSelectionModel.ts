import { isBasicPokemonCard } from '../lib/game/playTargets';
import type { CardView, PlayerView, PokemonSlotView } from '../lib/game/types';

export type SetupSelectionState = {
  activeIndex: number | null;
  benchIndexes: number[];
};

export type SetupPlacementContext = {
  promptPlayerIndex: number | undefined;
  selectedHandIndex: number | undefined;
  hasEngineActive: boolean;
  activeIndex: number | null;
  benchIndexes: number[];
  minSelections: number;
  benchCapacity: number;
};

export function setupPlacedIndexes(state: SetupSelectionState) {
  return [state.activeIndex, ...state.benchIndexes].filter((index): index is number => index !== null);
}

export function placeSetupActive(state: SetupSelectionState, handIndex: number): SetupSelectionState {
  return {
    activeIndex: handIndex,
    benchIndexes: state.benchIndexes.filter((index) => index !== handIndex),
  };
}

export function placeSetupBench(state: SetupSelectionState, handIndex: number): SetupSelectionState {
  if (handIndex === state.activeIndex || state.benchIndexes.includes(handIndex)) {
    return state;
  }
  return {
    ...state,
    benchIndexes: [...state.benchIndexes, handIndex],
  };
}

export function removeSetupPlacement(state: SetupSelectionState, handIndex: number): SetupSelectionState {
  return {
    activeIndex: state.activeIndex === handIndex ? null : state.activeIndex,
    benchIndexes: state.benchIndexes.filter((index) => index !== handIndex),
  };
}

export function isSetupStartable(
  card: CardView | undefined,
  handIndex: number,
  blockedIndexes: ReadonlySet<number>,
  hasSetupPrompt: boolean,
) {
  return hasSetupPrompt && !blockedIndexes.has(handIndex) && isBasicPokemonCard(card);
}

export function canPlaceSetupActive(slot: PokemonSlotView, context: SetupPlacementContext) {
  return (
    context.promptPlayerIndex !== undefined &&
    !context.hasEngineActive &&
    slot.ownerIndex === context.promptPlayerIndex &&
    slot.slot === 'active' &&
    context.selectedHandIndex !== undefined
  );
}

export function canPlaceSetupBench(player: PlayerView, context: SetupPlacementContext) {
  const hasActive = context.hasEngineActive || context.activeIndex !== null || context.minSelections === 0;
  const handIndex = context.selectedHandIndex;
  return (
    context.promptPlayerIndex !== undefined &&
    player.index === context.promptPlayerIndex &&
    hasActive &&
    handIndex !== undefined &&
    handIndex !== context.activeIndex &&
    !context.benchIndexes.includes(handIndex) &&
    context.benchIndexes.length < context.benchCapacity
  );
}
