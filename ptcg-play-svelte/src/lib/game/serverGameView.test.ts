import { describe, expect, it } from 'vitest';
import { stateToGameView } from './serverGameView';

describe('serverGameView', () => {
  it('preserves sanitized unknown cards and merges incremental logs', () => {
    const view = stateToGameView(
      serverState({
        logs: [{ id: 2, message: 'next' }],
      }),
      1,
      [{ id: 1, message: 'previous' }],
    );

    expect(view.logs.map((log) => log.message)).toEqual(['previous', 'next']);
    expect(view.players[1].hand[0]).toMatchObject({ name: 'Unknown', fullName: 'Unknown' });
  });

  it('keeps only prompts for the connected client', () => {
    const view = stateToGameView(
      serverState({
        prompts: [
          prompt({ id: 10, playerId: 1 }),
          prompt({ id: 11, playerId: 2 }),
        ],
      }),
      1,
    );

    expect(view.prompts).toHaveLength(1);
    expect(view.prompts[0]).toMatchObject({ id: 10, playerId: 1, playerIndex: 0 });
  });
});

function serverState(overrides: Record<string, unknown> = {}) {
  return {
    phase: 2,
    turn: 3,
    activePlayer: 0,
    winner: -1,
    logs: [],
    prompts: [],
    players: [
      player({ id: 1, name: 'Alice', hand: [{ id: 1, name: 'Dreepy', fullName: 'Dreepy TWM' }] }),
      player({ id: 2, name: 'Bob', hand: [{ id: 0, name: 'Unknown', fullName: 'Unknown' }] }),
    ],
    ...overrides,
  } as any;
}

function player(input: { id: number; name: string; hand: unknown[] }) {
  return {
    id: input.id,
    name: input.name,
    hand: { cards: input.hand },
    deck: { cards: [] },
    discard: { cards: [] },
    lostzone: { cards: [] },
    stadium: { cards: [] },
    supporter: { cards: [] },
    active: { cards: [], damage: 0, hp: 0, energies: { cards: [] }, tools: [] },
    bench: [],
    prizes: [],
    playableCardIds: [],
  };
}

function prompt(input: { id: number; playerId: number }) {
  return {
    id: input.id,
    playerId: input.playerId,
    type: 'Confirm',
    message: 'CONFIRM',
    constructor: { name: 'ConfirmPrompt' },
  };
}
