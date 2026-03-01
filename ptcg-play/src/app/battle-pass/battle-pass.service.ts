import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BattlePassData,
  BattlePassProgressData,
  BattlePassSeasonsData,
  PendingMatchRewardResponse,
  XpGainData
} from './battle-pass.model';

export interface ActiveSeasonResponse {
  ok: boolean;
  seasonId: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class BattlePassService {

  constructor(private api: ApiService) { }

  public getActiveSeason(): Observable<string | null> {
    return this.api.get<ActiveSeasonResponse>('/v1/battlepass/active-season').pipe(
      map(res => res.seasonId ?? null)
    );
  }

  public setActiveSeason(seasonId: string): Observable<void> {
    return this.api.post<void>('/v1/battlepass/active-season', { seasonId });
  }

  public getPendingMatchReward(): Observable<XpGainData | null> {
    return this.api.get<PendingMatchRewardResponse>('/v1/battlepass/pending-match-reward').pipe(
      map(res => res.reward)
    );
  }

  public getCurrentSeason(): Observable<BattlePassData> {
    return this.api.get<BattlePassData>('/v1/battlepass/current');
  }

  public getSeasons(): Observable<BattlePassSeasonsData> {
    return this.api.get<BattlePassSeasonsData>('/v1/battlepass/seasons');
  }

  public getSeason(seasonId: string): Observable<BattlePassData> {
    return this.api.get<BattlePassData>(`/v1/battlepass/season/${encodeURIComponent(seasonId)}`);
  }

  public getProgress(seasonId?: string): Observable<BattlePassProgressData> {
    const params = seasonId ? { seasonId } : undefined;
    return this.api.get<BattlePassProgressData>('/v1/battlepass/progress', params);
  }

  public claimReward(level: number, seasonId: string): Observable<void> {
    return this.api.post<void>('/v1/battlepass/claim', { level, seasonId });
  }

  public addDebugExp(exp: number): Observable<void> {
    return this.api.post<void>('/v1/battlepass/debug/add-exp', { exp });
  }
}
