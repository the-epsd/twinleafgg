import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { DeckListResponse, DeckResponse, DeckStatsResponse } from '../interfaces/deck.interface';
import { Response } from '../interfaces/response.interface';
import { Format, Archetype } from 'ptcg-server';
import { map } from 'rxjs/operators';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';


@Injectable()
export class DeckService {

  constructor(
    private api: ApiService,
    private cardsBaseService: CardsBaseService
  ) { }

  public getList() {
    return this.api.get<DeckListResponse>('/v1/decks/list');
  }

  public getListByFormat(format: Format) {
    if (!format) {
      return this.getList().pipe(map(decks => decks.decks));
    }
    return this.getList().pipe(
      map(decks => {
        return decks.decks.filter(deck => {
          return Array.isArray(deck.format) && deck.format.includes(format);
        });
      })
    )
  }

  public getDeck(deckId: number) {
    return this.api.get<DeckResponse>('/v1/decks/get/' + deckId);
  }

  public createDeck(deckName: string) {
    return this.api.post<DeckResponse>('/v1/decks/save', {
      name: deckName,
      cards: []
    });
  }

  public saveDeck(
    deckId: number,
    name: string,
    cards: string[],
    manualArchetype1?: Archetype,
    manualArchetype2?: Archetype,
    artworks?: { code: string; artworkId?: number }[]
  ) {
    return this.api.post<DeckResponse>('/v1/decks/save', {
      id: deckId,
      name,
      cards,
      manualArchetype1,
      manualArchetype2,
      ...(artworks ? { artworks } : {})
    });
  }

  public deleteDeck(deckId: number) {
    return this.api.post<Response>('/v1/decks/delete', {
      id: deckId
    });
  }

  public rename(deckId: number, name: string) {
    return this.api.post<Response>('/v1/decks/rename', {
      id: deckId,
      name
    });
  }

  public duplicate(deckId: number, name: string) {
    return this.api.post<Response>('/v1/decks/duplicate', {
      id: deckId,
      name
    });
  }

  /**
   * Calls the backend to get valid formats for a list of card names.
   * @param cardNames string[]
   * @returns Observable<number[]>
   */
  public getValidFormatsForCardList(cardNames: string[]) {
    return this.api.post<any>('/v1/decks/validate-formats', { cardNames }).pipe(
      map(response => response.formats || [])
    );
  }

  public getDeckStats(deckId: number, replayLimit?: number) {
    const params = replayLimit !== undefined ? { limit: replayLimit } : undefined;
    return this.api.get<DeckStatsResponse>('/v1/decks/stats/' + deckId, params);
  }

}
