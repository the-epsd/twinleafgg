import { Replay } from './replay';
import { validateReplayActions } from './replay-runner';
import { createHeadlessGame } from '../headless/headless-session';
import { State, GamePhase } from '../store/state/state';

describe('Replay', () => {
  it('round-trips replay action records with state diffs', () => {
    const replay = new Replay({ indexEnabled: false });
    const state = new State();
    state.phase = GamePhase.PLAYER_TURN;
    state.turn = 3;
    state.activePlayer = 1;

    replay.setGameSettings(state.gameSettings);
    replay.appendState(state);
    replay.appendAction('PLAY_CARD_ACTION', {
      id: 7,
      handIndex: 2,
      target: { player: 1, slot: 2, index: 0 }
    }, state, replay.getStateCount() - 1);

    const restored = new Replay({ indexEnabled: false });
    restored.deserialize(replay.serialize());

    expect(restored.getStateCount()).toBe(1);
    expect(restored.getGameSettings()).toEqual(JSON.parse(JSON.stringify(state.gameSettings)));
    expect(restored.getActions()).toEqual([{
      sequence: 0,
      type: 'PLAY_CARD_ACTION',
      turn: 3,
      phase: GamePhase.PLAYER_TURN,
      activePlayer: 1,
      stateIndex: 0,
      payload: {
        id: 7,
        handIndex: 2,
        target: { player: 1, slot: 2, index: 0 }
      }
    }]);
  });

  it('validates recorded action records against stored replay states', () => {
    const game = createHeadlessGame({
      player1: {
        name: 'Agent A',
        active: { card: 'Raichu SIT', energy: ['Lightning Energy SVE'] },
        deck: ['Water Energy SVE']
      },
      player2: {
        name: 'Agent B',
        active: { card: 'Ralts SIT' },
        deck: ['Water Energy SVE']
      },
      turn: 2,
      activePlayer: 0
    });
    const replay = new Replay({ indexEnabled: false });
    replay.setGameSettings(game.state.gameSettings);
    replay.appendState(game.state);
    game.drainEvents();

    game.attack(0, 'Ambushing Spark');
    replay.appendState(game.state);
    const stateIndex = replay.getStateCount() - 1;
    const actionEvents = game.drainEvents().filter(event => event.type === 'action');
    actionEvents.forEach(event => {
      replay.appendAction(
        event.payload.type,
        event.payload.payload,
        {
          turn: event.payload.turn,
          phase: event.payload.phase,
          activePlayer: event.payload.activePlayer
        },
        stateIndex
      );
    });

    const result = validateReplayActions(replay, { initialState: replay.getState(0) });

    expect(result.ok).toBe(true);
    expect(actionEvents.some(event => event.payload.type === 'RESOLVE_PROMPT')).toBe(true);
    expect(result.actionCount).toBe(actionEvents.length);
    expect(result.checkedStateCount).toBe(1);
    expect(result.mismatches).toEqual([]);
  });

  it('validates deck-game setup from a blank store using recorded actions', () => {
    const deck = ['Ralts SIT', 'Ralts SIT', 'Ralts SIT', 'Ralts SIT', ...Array(56).fill('Water Energy SVE')];
    const game = createHeadlessGame({
      player1: { name: 'Agent A', deck },
      player2: { name: 'Agent B', deck }
    });
    const replay = new Replay({ indexEnabled: false });
    replay.setGameSettings(game.state.gameSettings);
    replay.appendState(game.state);
    const actionEvents = game.drainEvents().filter(event => event.type === 'action');
    actionEvents.forEach(event => {
      replay.appendAction(
        event.payload.type,
        event.payload.payload,
        {
          turn: event.payload.turn,
          phase: event.payload.phase,
          activePlayer: event.payload.activePlayer
        },
        0
      );
    });

    const result = validateReplayActions(replay);

    expect(actionEvents.some(event => event.payload.type === 'ADD_PLAYER')).toBe(true);
    expect(actionEvents.some(event => event.payload.type === 'RESOLVE_PROMPT')).toBe(true);
    expect(result.ok).toBe(true);
    expect(result.checkedStateCount).toBe(1);
    expect(result.mismatches).toEqual([]);
  });
});
