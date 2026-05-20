import { beforeEach, describe, expect, it } from 'vitest';
import {
  type SetupSelectionState,
  placeSetupActive,
  placeSetupBench,
  removeSetupPlacement,
  setupPlacedIndexes,
} from './setupSelectionModel';

describe('setup selection model', () => {
  let state: SetupSelectionState;

  beforeEach(() => {
    state = { activeIndex: null, benchIndexes: [] };
  });

  it('moves an active selection out of bench placements', () => {
    state = placeSetupBench(state, 2);
    state = placeSetupBench(state, 4);

    state = placeSetupActive(state, 2);

    expect(state.activeIndex).toBe(2);
    expect(state.benchIndexes).toEqual([4]);
    expect(setupPlacedIndexes(state)).toEqual([2, 4]);
  });

  it('does not duplicate bench placements', () => {
    state = placeSetupBench(state, 3);
    state = placeSetupBench(state, 3);

    expect(state.benchIndexes).toEqual([3]);
  });

  it('removes active and bench placements by hand index', () => {
    state = placeSetupActive(state, 1);
    state = placeSetupBench(state, 3);
    state = placeSetupBench(state, 5);

    state = removeSetupPlacement(state, 1);
    state = removeSetupPlacement(state, 5);

    expect(state.activeIndex).toBeNull();
    expect(state.benchIndexes).toEqual([3]);
  });
});
