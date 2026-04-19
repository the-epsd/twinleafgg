import type { GameState } from 'ptcg-server';
import { Base64, Replay, StateSerializer } from 'ptcg-server';
import { apiGet } from './client';
import { gameStateToLocal } from '../table/gameSessionUtils';
import type { LocalGameState } from '../table/types/localGameState';

export interface MatchReplayDataResponse {
  ok: boolean;
  replayData: string;
}

export function getMatchReplayData(matchId: number): Promise<MatchReplayDataResponse> {
  return apiGet<MatchReplayDataResponse>(`/v1/replays/match/${matchId}`);
}

export async function buildLocalGameFromMatchReplay(matchId: number): Promise<LocalGameState> {
  const response = await getMatchReplayData(matchId);
  const replay = new Replay();
  const base64 = new Base64();
  replay.deserialize(base64.decode(response.replayData));
  const state = replay.getState(0);
  const serializer = new StateSerializer();
  const serializedState = serializer.serialize(state);
  const stateData = base64.encode(serializedState);
  const gs: GameState = {
    gameId: 0,
    stateData,
    clientIds: [],
    recordingEnabled: false,
    timeLimit: 0,
    playerStats: [],
  };
  return gameStateToLocal(gs, replay);
}
