export type SetupSelectionState = {
  activeIndex: number | null;
  benchIndexes: number[];
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
