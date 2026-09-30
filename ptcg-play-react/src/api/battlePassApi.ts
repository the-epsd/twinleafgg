import { apiGet, apiPost } from './client';
import type {
  ActiveSeasonResponse,
  BattlePassData,
  BattlePassProgressData,
  BattlePassSeasonsData,
  PendingMatchRewardResponse,
  XpGainData,
} from '../types/battlePass';

function draftsQuery(includeDrafts?: boolean): string {
  return includeDrafts ? 'includeDrafts=1' : '';
}

function withQuery(path: string, parts: Array<string | false | undefined | null>): string {
  const q = parts.filter(Boolean).join('&');
  return q ? `${path}?${q}` : path;
}

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

export function getBattlePassSeasons(includeDrafts?: boolean): Promise<BattlePassSeasonsData> {
  return apiGet<BattlePassSeasonsData>(
    withQuery('/v1/battlepass/seasons', [draftsQuery(includeDrafts)])
  );
}

export function getBattlePassSeason(seasonId: string, includeDrafts?: boolean): Promise<BattlePassData> {
  return apiGet<BattlePassData>(
    withQuery(`/v1/battlepass/season/${encodeURIComponent(seasonId)}`, [draftsQuery(includeDrafts)])
  );
}

export function getBattlePassProgress(seasonId?: string, includeDrafts?: boolean): Promise<BattlePassProgressData> {
  return apiGet<BattlePassProgressData>(
    withQuery('/v1/battlepass/progress', [
      seasonId ? `seasonId=${encodeURIComponent(seasonId)}` : '',
      draftsQuery(includeDrafts),
    ])
  );
}

export function claimBattlePassReward(level: number, seasonId: string): Promise<void> {
  return apiPost<void>('/v1/battlepass/claim', { level, seasonId });
}

export function addBattlePassDebugExp(exp: number, seasonId?: string): Promise<void> {
  return apiPost<void>('/v1/battlepass/debug/add-exp', { exp, ...(seasonId ? { seasonId } : {}) });
}
