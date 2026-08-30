import type { GameState, GameWinner, UserInfo } from 'ptcg-server';
import { Base64, Replay, StateSerializer } from 'ptcg-server';
import { apiGet, apiPost } from './client';
import { gameStateToLocal } from '../table/gameSessionUtils';
import type { LocalGameState } from '../table/types/localGameState';
import type { OkResponse } from '../types/responses';

export interface ReplayInfo {
  replayId: number;
  name: string;
  player1: UserInfo;
  player2: UserInfo;
  winner: GameWinner;
  created: number;
}

export interface ReplayDataResponse {
  ok: boolean;
  replayData: string;
}

export interface ReplayListResponse {
  ok: boolean;
  replays: ReplayInfo[];
  total: number;
}

export interface ReplayResponse {
  ok: boolean;
  replay: ReplayInfo;
}

export function getReplayList(page = 0, query = ''): Promise<ReplayListResponse> {
  const path = `/v1/replays/list/${page}`;
  return query === ''
    ? apiGet<ReplayListResponse>(path)
    : apiPost<ReplayListResponse>(path, { query });
}

export function getMatchReplayData(matchId: number): Promise<ReplayDataResponse> {
  return apiGet<ReplayDataResponse>(`/v1/replays/match/${matchId}`);
}

export function getReplayData(replayId: number): Promise<ReplayDataResponse> {
  return apiGet<ReplayDataResponse>(`/v1/replays/get/${replayId}`);
}

export function importReplay(replayData: string, name: string): Promise<ReplayResponse> {
  return apiPost<ReplayResponse>('/v1/replays/import', { replayData, name });
}

export function deleteReplay(replayId: number): Promise<OkResponse> {
  return apiPost<OkResponse>('/v1/replays/delete', { id: replayId });
}

export function renameReplay(replayId: number, name: string): Promise<OkResponse> {
  return apiPost<OkResponse>('/v1/replays/rename', { id: replayId, name });
}

export function saveMatchReplay(matchId: number, name: string): Promise<ReplayResponse> {
  return apiPost<ReplayResponse>('/v1/replays/save', { id: matchId, name });
}

function localGameFromReplayData(replayData: string): LocalGameState {
  const replay = new Replay();
  const base64 = new Base64();
  replay.deserialize(base64.decode(replayData));
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

export async function buildLocalGameFromMatchReplay(matchId: number): Promise<LocalGameState> {
  const response = await getMatchReplayData(matchId);
  return localGameFromReplayData(response.replayData);
}

export async function buildLocalGameFromSavedReplay(replayId: number): Promise<LocalGameState> {
  const response = await getReplayData(replayId);
  return localGameFromReplayData(response.replayData);
}

/** Download a `.rep` file (base64 payload as plain text), matching Angular export. */
export function downloadReplayFile(replayData: string, fileName: string): void {
  const blob = new Blob([replayData], { type: 'text/plain' });
  const a = document.createElement('a');
  a.setAttribute('download', fileName.endsWith('.rep') ? fileName : `${fileName}.rep`);
  a.setAttribute('href', window.URL.createObjectURL(blob));
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(a.href);
}
