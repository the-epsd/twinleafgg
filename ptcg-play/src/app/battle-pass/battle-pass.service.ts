import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable } from 'rxjs';
import { BattlePassData, BattlePassProgressData } from './battle-pass.model';

@Injectable({
  providedIn: 'root'
})
export class BattlePassService {

  constructor(private api: ApiService) { }

  public getCurrentSeason(): Observable<BattlePassData> {
    return this.api.get<BattlePassData>('/v1/battlepass/current');
  }

  public getProgress(): Observable<BattlePassProgressData> {
    return this.api.get<BattlePassProgressData>('/v1/battlepass/progress');
  }

  public claimReward(level: number): Observable<void> {
    return this.api.post<void>('/v1/battlepass/claim', { level });
  }

  public addDebugExp(exp: number): Observable<void> {
    return this.api.post<void>('/v1/battlepass/debug/add-exp', { exp });
  }
}
