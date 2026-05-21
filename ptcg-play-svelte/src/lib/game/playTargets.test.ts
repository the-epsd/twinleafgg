import { describe, expect, it } from 'vitest';
import {
  canEvolveSlot,
  canPlayCardToBoardArea,
  canPlayCardToPlayArea,
  canPlayCardToSlot,
  canPlayerAct,
  canRetreatToSlot,
  isBasicPokemonCard,
  isEnergyCard,
  isPokemonCard,
  playableBenchSlot,
} from './playTargets';
import { SlotType, targetFor, type CardView, type PlayerView, type PokemonSlotView } from './types';

const energy: CardView = { name: 'Psychic Energy', fullName: 'Psychic Energy SVE', energyType: 5 };
const pokemon: CardView = { name: 'Ralts', fullName: 'Ralts SIT', stage: 2 };
const evolution: CardView = { name: 'Kirlia', fullName: 'Kirlia SIT', stage: 3, evolvesFrom: 'Ralts' };
const trainer: CardView = { name: 'Nest Ball', fullName: 'Nest Ball SVI', trainerType: 0 };
const tool: CardView = { name: 'Bravery Charm', fullName: 'Bravery Charm PAL', trainerType: 3 };

describe('play target rules', () => {
  it('classifies ordinary card types for board targeting', () => {
    expect(isEnergyCard(energy)).toBe(true);
    expect(isPokemonCard(energy)).toBe(false);
    expect(isPokemonCard(pokemon)).toBe(true);
    expect(isBasicPokemonCard(pokemon)).toBe(true);
    expect(isBasicPokemonCard(evolution)).toBe(false);
  });

  it('allows energy only on occupied acting-player Pokemon slots', () => {
    expect(canPlayCardToSlot(energy, 0, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(energy, 0, slot(0, 'bench', 0, false))).toBe(true);
    expect(canPlayCardToSlot(energy, 0, slot(0, 'bench', 0, true))).toBe(false);
    expect(canPlayCardToSlot(energy, 0, slot(1, 'active', 0, false))).toBe(false);
  });

  it('allows Basic Pokemon only onto empty acting-player bench slots', () => {
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'bench', 0, true))).toBe(true);
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'active', 0, true))).toBe(false);
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'active', 0, false))).toBe(false);
    expect(canPlayCardToSlot(pokemon, 0, slot(0, 'bench', 0, false))).toBe(false);
    expect(canPlayCardToSlot(pokemon, 0, slot(1, 'bench', 0, true))).toBe(false);
  });

  it('allows evolutions only onto matching occupied Pokemon slots', () => {
    expect(canEvolveSlot(evolution, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(evolution, 0, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(evolution, 0, slot(0, 'bench', 0, true))).toBe(false);
    expect(canPlayCardToSlot({ ...evolution, evolvesFrom: 'Charmander' }, 0, slot(0, 'active', 0, false))).toBe(false);
  });

  it('uses the board area for generic trainers and slots for tools', () => {
    expect(canPlayCardToPlayArea(trainer, 0)).toBe(true);
    expect(canPlayCardToSlot(trainer, 0, slot(0, 'active', 0, false))).toBe(false);
    expect(canPlayCardToPlayArea(tool, 0)).toBe(false);
    expect(canPlayCardToSlot(tool, 0, slot(0, 'active', 0, false))).toBe(true);
    expect(canPlayCardToSlot(tool, 0, slot(0, 'bench', 0, true))).toBe(false);
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
    expect(
      canPlayCardToBoardArea({
        selected: pokemon,
        selectedPlayerIndex: 0,
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
        selected: energy,
        selectedPlayerIndex: 0,
        dragging: undefined,
        draggingPlayerIndex: undefined,
        activePlayerIndex: 0,
        hasPrompt: false,
        finished: false,
        inSetup: false,
      }),
    ).toBe(false);
  });

  it('allows retreat attempts only to occupied own bench slots', () => {
    const active = { ...slot(0, 'active', 0, false), retreat: [9], energy: [energy] };
    expect(canRetreatToSlot(active, slot(0, 'bench', 0, false))).toBe(true);
    expect(canRetreatToSlot({ ...active, energy: [] }, slot(0, 'bench', 0, false))).toBe(true);
    expect(canRetreatToSlot(active, slot(0, 'bench', 0, true))).toBe(false);
    expect(canRetreatToSlot(active, slot(1, 'bench', 0, false))).toBe(false);
  });

  it('allows player actions only for the active player outside prompts and finished games', () => {
    expect(canPlayerAct({ playerIndex: 0, activePlayerIndex: 0, hasPrompt: false, finished: false })).toBe(true);
    expect(canPlayerAct({ playerIndex: 1, activePlayerIndex: 0, hasPrompt: false, finished: false })).toBe(false);
    expect(canPlayerAct({ playerIndex: 0, activePlayerIndex: 0, hasPrompt: true, finished: false })).toBe(false);
    expect(canPlayerAct({ playerIndex: 0, activePlayerIndex: 0, hasPrompt: false, finished: true })).toBe(false);
  });

  it('uses the bench-area shortcut only for Basic Pokemon entering an empty bench slot', () => {
    const currentPlayer = player(0, [slot(0, 'bench', 0, false), slot(0, 'bench', 1, true)]);
    expect(playableBenchSlot(currentPlayer, pokemon, 0, false)?.index).toBe(1);
    expect(playableBenchSlot(currentPlayer, pokemon, 0, true)).toBeUndefined();
    expect(playableBenchSlot(currentPlayer, pokemon, 1, false)).toBeUndefined();
    expect(playableBenchSlot(currentPlayer, energy, 0, false)).toBeUndefined();
    expect(playableBenchSlot(currentPlayer, evolution, 0, false)).toBeUndefined();
    expect(playableBenchSlot(currentPlayer, tool, 0, false)).toBeUndefined();
  });

  it('does not guess an evolution target when several matching Pokemon are on the bench', () => {
    const dreepy: CardView = { name: 'Dreepy', fullName: 'Dreepy DRI', stage: 2 };
    const drakloak: CardView = { name: 'Drakloak', fullName: 'Drakloak DRI', stage: 3, evolvesFrom: 'Dreepy' };
    const bench = [
      { ...slot(0, 'bench', 0, false), pokemon: dreepy, cards: [dreepy] },
      { ...slot(0, 'bench', 1, false), pokemon: dreepy, cards: [dreepy] },
      { ...slot(0, 'bench', 2, false), pokemon: dreepy, cards: [dreepy] },
    ];
    const currentPlayer = player(0, bench);

    expect(playableBenchSlot(currentPlayer, drakloak, 0, false)).toBeUndefined();
    expect(currentPlayer.bench.map((benchSlot) => canPlayCardToSlot(drakloak, 0, benchSlot))).toEqual([true, true, true]);
  });
});

function player(index: number, bench: PokemonSlotView[]): PlayerView {
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
    active: slot(index, 'active', 0, true),
    bench,
    playableCardIds: [],
  };
}

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
