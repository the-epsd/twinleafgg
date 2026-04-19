import { apiGet, apiPost } from './client';
import type {
  ActiveSeasonResponse,
  BattlePassData,
  BattlePassProgressData,
  BattlePassSeasonsData,
  PendingMatchRewardResponse,
  XpGainData,
} from '../types/battlePass';

export function getBattlePassActiveSeason(): Promise<ActiveSeasonResponse> {
  return apiGet<ActiveSeasonResponse>('/v1/battlepass/active-season');
}

export function setBattlePassActiveSeason(seasonId: string): Promise<void> {
  return apiPost<void>('/v1/battlepass/active-season', { seasonId });
}

export function getBattlePassPendingMatchReward(): Promise<XpGainData | null> {
  return apiGet<PendingMatchRewardResponse>('/v1/battlepass/pending-match-reward').then((res) => res.reward ?? null);
}

export function getBattlePassCurrent(): Promise<BattlePassData> {
  return apiGet<BattlePassData>('/v1/battlepass/current');
}

export function getBattlePassSeasons(): Promise<BattlePassSeasonsData> {
  return apiGet<BattlePassSeasonsData>('/v1/battlepass/seasons');
}

export function getBattlePassSeason(seasonId: string): Promise<BattlePassData> {
  return apiGet<BattlePassData>(`/v1/battlepass/season/${encodeURIComponent(seasonId)}`);
}

export function getBattlePassProgress(seasonId?: string): Promise<BattlePassProgressData> {
  const q = seasonId ? `?seasonId=${encodeURIComponent(seasonId)}` : '';
  return apiGet<BattlePassProgressData>(`/v1/battlepass/progress${q}`);
}

export function claimBattlePassReward(level: number, seasonId: string): Promise<void> {
  return apiPost<void>('/v1/battlepass/claim', { level, seasonId });
}

export function addBattlePassDebugExp(exp: number): Promise<void> {
  return apiPost<void>('/v1/battlepass/debug/add-exp', { exp });
}
