import { apiGet, apiPost } from './client';
import type { RankingResponse } from '../types/responses';

export function getRankingList(page: number, query = ''): Promise<RankingResponse> {
  const path = `/v1/ranking/list/${page}`;
  return query === ''
    ? apiGet<RankingResponse>(path)
    : apiPost<RankingResponse>(path, { query });
}
