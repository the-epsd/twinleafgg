import { describe, expect, it } from 'vitest';
import {
  canEvolveSlot,
  canPlayCardToBoardArea,
  canPlayCardToPlayArea,
  canPlayCardToSlot,
  canRetreatToSlot,
  isBasicPokemonCard,
  isEnergyCard,
  isPokemonCard,
} from './playTargets';
import { SlotType, targetFor, type CardView, type PokemonSlotView } from './types';

const energy: CardView = { name: 'Psychic Energy', fullName: 'Psychic Energy SVE', energyType: 5 };
const pokemon: CardView = { name: 'Ralts', fullName: 'Ralts SIT', stage: 2 };
const evolution: CardView = { name: 'Kirlia', fullName: 'Kirlia SIT', stage: 3, evolvesFrom: 'Ralts' };
const trainer: CardView = { name: 'Nest Ball', fullName: 'Nest Ball SVI', trainerType: 0 };

describe('play target rules', () => {
  it('classifies ordinary card types for board targeting', () => {
    expect(isEnergyCard(energy)).toBe(true);
    expect(isPokemonCard(energy)).toBe(false);
    expect(isPokemonCard(pokemon)).toBe(true);
    expect(isBasicPokemonCard(pokemon)).toBe(true);
    expect(isBasicPokemonCard(evolution)).toBe(false);
  });

  it('allows energy only on the acting player occupied Pokemon', () => {
    expect(canPlayCardToSlot(energy, 0, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(energy, 0, slot(0, 'bench', 0, true))).toBe(false);
    expect(canPlayCardToSlot(energy, 0, slot(1, 'active', 0, false))).toBe(false);
  });

  it('allows Pokemon only on the acting player empty Pokemon slots', () => {
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'bench', 0, true))).toBe(true);
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'active', 0, true))).toBe(true);
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'bench', 0, false))).toBe(false);
    expect(canPlayCardToSlot(pokemon, 0, slot(1, 'bench', 0, true))).toBe(false);
  });

  it('allows evolution Pokemon on matching occupied slots', () => {
    expect(canEvolveSlot(evolution, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(evolution, 0, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(evolution, 0, slot(0, 'bench', 0, true))).toBe(false);
    expect(canPlayCardToSlot({ ...evolution, evolvesFrom: 'Charmander' }, 0, slot(0, 'active', 0, false))).toBe(false);
  });

  it('keeps trainer fallback on the generic play area', () => {
    expect(canPlayCardToPlayArea(trainer, 0)).toBe(true);
    expect(canPlayCardToSlot(trainer, 0, slot(0, 'active', 0, false))).toBe(false);
    expect(canPlayCardToSlot(trainer, 0, slot(0, 'bench', 0, false))).toBe(false);
  });

  it('allows selected or dragged generic play cards on the board area only for the active player', () => {
    expect(
      canPlayCardToBoardArea({
        selected: trainer,
        selectedPlayerIndex: 0,
        dragging: undefined,
        draggingPlayerIndex: undefined,
        activePlayerIndex: 0,
        hasPrompt: false,
        finished: false,
        inSetup: false,
      }),
    ).toBe(true);
    expect(
      canPlayCardToBoardArea({
        selected: undefined,
        selectedPlayerIndex: undefined,
        dragging: trainer,
        draggingPlayerIndex: 0,
        activePlayerIndex: 0,
        hasPrompt: false,
        finished: false,
        inSetup: false,
      }),
    ).toBe(true);
    expect(
      canPlayCardToBoardArea({
        selected: trainer,
        selectedPlayerIndex: 1,
        dragging: undefined,
        draggingPlayerIndex: undefined,
        activePlayerIndex: 0,
        hasPrompt: false,
        finished: false,
        inSetup: false,
      }),
    ).toBe(false);
    expect(
      canPlayCardToBoardArea({
        selected: trainer,
        selectedPlayerIndex: 0,
        dragging: undefined,
        draggingPlayerIndex: undefined,
        activePlayerIndex: 0,
        hasPrompt: true,
        finished: false,
        inSetup: false,
      }),
    ).toBe(false);
  });

  it('allows retreat only to occupied own bench slots when enough energy is attached', () => {
    const active = { ...slot(0, 'active', 0, false), retreat: [9], energy: [energy] };
    expect(canRetreatToSlot(active, slot(0, 'bench', 0, false))).toBe(true);
    expect(canRetreatToSlot({ ...active, energy: [] }, slot(0, 'bench', 0, false))).toBe(false);
    expect(canRetreatToSlot(active, slot(0, 'bench', 0, true))).toBe(false);
    expect(canRetreatToSlot(active, slot(1, 'bench', 0, false))).toBe(false);
  });
});

function slot(ownerIndex: number, kind: 'active' | 'bench', index: number, empty: boolean): PokemonSlotView {
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(ownerIndex, ownerIndex, kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH, index),
    empty,
    pokemon: empty ? undefined : pokemon,
    cards: empty ? [] : [pokemon],
    damage: 0,
    hp: empty ? 0 : 60,
    retreat: [],
    energy: [],
    tools: [],
    specialConditions: [],
  };
}
