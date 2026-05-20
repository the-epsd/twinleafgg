import { beforeEach, describe, expect, it } from 'vitest';
import {
  type SetupPlacementContext,
  type SetupSelectionState,
  canPlaceSetupActive,
  canPlaceSetupBench,
  isSetupStartable,
  placeSetupActive,
  placeSetupBench,
  removeSetupPlacement,
  setupPlacedIndexes,
} from './setupSelectionModel';
import type { CardView, PlayerView, PokemonSlotView } from '../lib/game/types';

function card(overrides: Partial<CardView> = {}): CardView {
  return {
    name: 'Bulbasaur',
    fullName: 'Bulbasaur',
    stage: 2,
    ...overrides,
  };
}

function slot(ownerIndex: number, slotName: 'active' | 'bench'): PokemonSlotView {
  return {
    ownerIndex,
    slot: slotName,
    index: 0,
    target: { player: 0, slot: 1, index: 0 },
    empty: true,
    cards: [],
    damage: 0,
    hp: 0,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}

function player(index: number): PlayerView {
  return {
    index,
    id: index + 1,
    name: `Player ${index + 1}`,
    hand: [],
    deckCount: 0,
    discard: [],
    lostZone: [],
    stadium: [],
    playZone: [],
    prizesLeft: 6,
    active: slot(index, 'active'),
    bench: [],
    playableCardIds: [],
  };
}

function placementContext(overrides: Partial<SetupPlacementContext> = {}): SetupPlacementContext {
  return {
    promptPlayerIndex: 0,
    selectedHandIndex: 1,
    hasEngineActive: false,
    activeIndex: null,
    benchIndexes: [],
    minSelections: 1,
    benchCapacity: 5,
    ...overrides,
  };
}

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

  it('marks only unblocked basic Pokemon as setup-startable', () => {
    expect(isSetupStartable(card(), 0, new Set(), true)).toBe(true);
    expect(isSetupStartable(card(), 0, new Set([0]), true)).toBe(false);
    expect(isSetupStartable(card({ trainerType: 1, stage: undefined }), 0, new Set(), true)).toBe(false);
    expect(isSetupStartable(card(), 0, new Set(), false)).toBe(false);
  });

  it('allows active placement only for the prompted player without an engine active', () => {
    expect(canPlaceSetupActive(slot(0, 'active'), placementContext())).toBe(true);
    expect(canPlaceSetupActive(slot(1, 'active'), placementContext())).toBe(false);
    expect(canPlaceSetupActive(slot(0, 'bench'), placementContext())).toBe(false);
    expect(canPlaceSetupActive(slot(0, 'active'), placementContext({ hasEngineActive: true }))).toBe(false);
    expect(canPlaceSetupActive(slot(0, 'active'), placementContext({ selectedHandIndex: undefined }))).toBe(false);
  });

  it('allows bench placement once active requirements are satisfied and capacity remains', () => {
    expect(canPlaceSetupBench(player(0), placementContext({ activeIndex: 2 }))).toBe(true);
    expect(canPlaceSetupBench(player(0), placementContext({ minSelections: 0 }))).toBe(true);
    expect(canPlaceSetupBench(player(0), placementContext())).toBe(false);
    expect(canPlaceSetupBench(player(1), placementContext({ activeIndex: 2 }))).toBe(false);
    expect(canPlaceSetupBench(player(0), placementContext({ activeIndex: 1 }))).toBe(false);
    expect(canPlaceSetupBench(player(0), placementContext({ activeIndex: 2, benchIndexes: [1] }))).toBe(false);
    expect(
      canPlaceSetupBench(player(0), placementContext({ activeIndex: 2, benchIndexes: [3, 4], benchCapacity: 2 })),
    ).toBe(false);
  });
});
