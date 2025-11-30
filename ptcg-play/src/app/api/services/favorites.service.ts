import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Response } from '../interfaces/response.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface FavoritesResponse {
  ok: boolean;
  favorites: { [cardName: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(
    private api: ApiService,
  ) { }

  public getFavorites(): Observable<{ [cardName: string]: string }> {
    return this.api.get<FavoritesResponse>('/v1/favorites/list').pipe(
      map(response => response.favorites || {})
    );
  }

  public setFavorite(cardName: string, fullName: string): Observable<Response> {
    return this.api.post<Response>('/v1/favorites/set', {
      cardName,
      fullName
    });
  }

  public clearFavorite(cardName: string): Observable<Response> {
    return this.api.post<Response>('/v1/favorites/clear', {
      cardName
    });
  }
}
