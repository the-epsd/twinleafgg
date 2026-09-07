import { apiDelete, apiGet, apiPost, apiPut } from './client';
import type { BattlePassReward, BattlePassSeason, BattlePassSeasonStatus } from '../types/battlePass';

export function adminListSeasons() {
  return apiGet<{ ok: boolean; seasons: BattlePassSeason[] }>('/v1/admin/battlepass/seasons');
}

export function adminCreateSeason(body: {
  seasonId: string;
  name: string;
  startDate: string;
  endDate?: string | null;
  status?: BattlePassSeasonStatus;
  baseXpPerLevel?: number;
  xpIncreasePerLevel?: number;
  maxLevel?: number;
}) {
  return apiPost<{ ok: boolean; season: BattlePassSeason }>('/v1/admin/battlepass/seasons', body);
}

export function adminUpdateSeason(
  seasonId: string,
  body: Partial<{
    name: string;
    startDate: string;
    endDate: string | null;
    status: BattlePassSeasonStatus;
    baseXpPerLevel: number;
    xpIncreasePerLevel: number;
    maxLevel: number;
  }>
) {
  return apiPut<{ ok: boolean; season: BattlePassSeason }>(
    `/v1/admin/battlepass/seasons/${encodeURIComponent(seasonId)}`,
    body
  );
}

export function adminDeleteSeason(seasonId: string) {
  return apiDelete<{ ok: boolean; deleted?: boolean; archived?: boolean }>(
    `/v1/admin/battlepass/seasons/${encodeURIComponent(seasonId)}`
  );
}

export function adminGetSeasonRewards(seasonId: string) {
  return apiGet<{ ok: boolean; season: BattlePassSeason; rewards: BattlePassReward[] }>(
    `/v1/admin/battlepass/seasons/${encodeURIComponent(seasonId)}/rewards`
  );
}

export function adminReplaceSeasonRewards(
  seasonId: string,
  rewards: Array<{ level: number; type: string; item: string; name: string; sortOrder?: number }>
) {
  return apiPut<{ ok: boolean; rewards: BattlePassReward[] }>(
    `/v1/admin/battlepass/seasons/${encodeURIComponent(seasonId)}/rewards`,
    { rewards }
  );
}
