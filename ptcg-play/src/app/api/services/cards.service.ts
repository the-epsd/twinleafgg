import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { CardsHashResponse, CardsResponse } from '../interfaces/cards.interface';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, map } from 'rxjs/operators';
import { CardsCacheService } from './cards-cache.service';
import { CardsInfo } from 'ptcg-server';

@Injectable()
export class CardsService {

  constructor(
    private api: ApiService,
    private cardsCacheService: CardsCacheService
  ) { }

  /**
   * Reads cards from cache (indexed-db) or fetch all cards from the server.
   */
  public getCardsInfo(): Observable<CardsInfo> {
    return this.cardsCacheService.getCardsInfo().pipe(

      // Error while reading data from db, handle it as data didn't exist
      catchError(() => of(undefined)),

      // Check if cards from cache are up-to-date
      switchMap((cardsInfo: CardsInfo | undefined) => {
        if (cardsInfo === undefined) {
          return of(undefined);
        }

        return this.getHash().pipe(switchMap(response => {
          if (response.cardsTotal !== cardsInfo.cards.length || response.hash !== cardsInfo.hash) {
            return of(undefined);
          }
          return of(cardsInfo);
        }));
      }),

      // No cards from cache, or invalid hash, need to fetch all cards from server
      switchMap((cardsInfo: CardsInfo | undefined) => {
        if (cardsInfo !== undefined) {
          return of(cardsInfo);
        }
        return this.getAll().pipe(switchMap(reponse =>
          this.cardsCacheService.saveCardsInfo(reponse.cardsInfo).pipe(
            map(() => reponse.cardsInfo),
            catchError(() => of(reponse.cardsInfo))
          )
        ));
      })
    );
  }

  public getAll() {
    return this.api.get<CardsResponse>('/v1/cards/all');
  }

  public getHash() {
    return this.api.get<CardsHashResponse>('/v1/cards/hash');
  }

}
