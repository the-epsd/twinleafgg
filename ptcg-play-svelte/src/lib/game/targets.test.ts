import { describe, expect, it } from 'vitest';
import {
  getAttachPromptTargets,
  getAttachTargets,
  getBoardPromptTargets,
  getSelectableTargets,
  sameTarget,
  targetForPromptSlot,
} from './targets';
import { PlayerType, SlotType, targetFor, type CardTarget, type GameView, type PlayerView, type PokemonSlotView, type PromptView } from './types';

const pokemon = { name: 'Ralts', fullName: 'Ralts SIT' };

describe('prompt target helpers', () => {
  it('compares targets by value', () => {
    expect(sameTarget(targetFor(0, 0, SlotType.ACTIVE), targetFor(0, 0, SlotType.ACTIVE))).toBe(true);
    expect(sameTarget(targetFor(0, 0, SlotType.ACTIVE), targetFor(0, 1, SlotType.ACTIVE))).toBe(false);
  });

  it('maps board slots through the prompt actor perspective', () => {
    const prompt = promptView({ playerIndex: 0 });
    expect(targetForPromptSlot(prompt, slot(1, 'bench', 2, false))).toEqual(targetFor(0, 1, SlotType.BENCH, 2));
  });

  it('filters board prompt targets by player type, slots, and blocked targets', () => {
    const blocked = targetFor(0, 0, SlotType.BENCH, 0);
    const game = gameView();
    const prompt = promptView({
      fields: {
        playerType: PlayerType.BOTTOM_PLAYER,
        slots: [SlotType.ACTIVE, SlotType.BENCH],
        options: { blocked: [blocked] },
      },
    });

    expect(getBoardPromptTargets(game, prompt)).toEqual([targetFor(0, 0, SlotType.ACTIVE)]);
    expect(getSelectableTargets(game, prompt)).toEqual([
      { label: 'Player 1 active', target: targetFor(0, 0, SlotType.ACTIVE) },
    ]);
  });

  it('uses blockedTo for attach-energy prompts', () => {
    const blockedTo = targetFor(0, 1, SlotType.ACTIVE);
    const game = gameView();
    const prompt = promptView({
      fields: {
        playerType: PlayerType.TOP_PLAYER,
        slots: [SlotType.ACTIVE, SlotType.BENCH],
        options: { blockedTo: [blockedTo] },
      },
    });

    expect(getAttachPromptTargets(game, prompt)).toEqual([targetFor(0, 1, SlotType.BENCH, 0)]);
    expect(getAttachTargets(game, prompt)).toEqual([
      {
        label: 'Player 2 bench 1',
        target: targetFor(0, 1, SlotType.BENCH, 0),
        card: pokemon,
      },
    ]);
  });
});

function gameView(): GameView {
  return {
    ready: true,
    phase: 2,
    phaseLabel: 'Player turn',
    turn: 1,
    activePlayerIndex: 0,
    players: [
      player(0, 'Player 1', [slot(0, 'bench', 0, false), slot(0, 'bench', 1, true)]),
      player(1, 'Player 2', [slot(1, 'bench', 0, false)]),
    ],
    prompts: [],
    logs: [],
    events: [],
  };
}

function player(index: number, name: string, bench: PokemonSlotView[]): PlayerView {
  return {
    index,
    id: index + 1,
    name,
    hand: [],
    deckCount: 0,
    discard: [],
    lostZone: [],
    stadium: [],
    playZone: [],
    prizesLeft: 6,
    active: slot(index, 'active', 0, false),
    bench,
    playableCardIds: [],
  };
}

function slot(ownerIndex: number, kind: 'active' | 'bench', index: number, empty: boolean): PokemonSlotView {
  return {
    ownerIndex,
    slot: kind,
    index,
    target: targetFor(0, ownerIndex, kind === 'active' ? SlotType.ACTIVE : SlotType.BENCH, index),
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

function promptView({
  playerIndex = 0,
  fields = {},
}: {
  playerIndex?: number;
  fields?: Record<string, unknown>;
} = {}): PromptView {
  return {
    id: 1,
    className: 'ChoosePokemonPrompt',
    type: 'Choose Pokemon',
    playerId: playerIndex + 1,
    playerIndex,
    supported: true,
    resultSchema: 'unknown',
    fields,
  };
}
