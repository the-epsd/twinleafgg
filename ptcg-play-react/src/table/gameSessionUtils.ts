import type { GameState, State } from 'ptcg-server';
import { Base64, StateSerializer } from 'ptcg-server';
import { extractEnhancedPlayerStatsFromState } from './end-game/playerGameStats';
import type { LocalGameState } from './types/localGameState';

let localIdSeq = 1;

export function decodeStateData(stateData: string): State {
  const base64 = new Base64();
  const serializedState = base64.decode(stateData);
  const serializer = new StateSerializer();
  return serializer.deserialize(serializedState);
}

export function gameStateToLocal(gs: GameState, replay?: LocalGameState['replay']): LocalGameState {
  const state = decodeStateData(gs.stateData);
  const localId = localIdSeq++;
  const enhancedPlayerStats = extractEnhancedPlayerStatsFromState(state);
  return {
    ...gs,
    localId,
    deleted: !!replay,
    gameOver: !!replay,
    switchSide: false,
    promptMinimized: false,
    state,
    logs: [...state.logs],
    replayPosition: 1,
    replay,
    enhancedPlayerStats,
  };
}

export function mergeStateChange(
  prev: LocalGameState,
  stateData: string,
  playerStats: import('ptcg-server').PlayerStats[] | undefined,
): LocalGameState {
  const state = decodeStateData(stateData);
  // State snapshots already include the full log history; appending would duplicate ids.
  const logs = [...state.logs];
  const enhancedPlayerStats = extractEnhancedPlayerStatsFromState(state);
  return {
    ...prev,
    state,
    logs,
    playerStats: playerStats ?? prev.playerStats,
    enhancedPlayerStats,
  };
}
