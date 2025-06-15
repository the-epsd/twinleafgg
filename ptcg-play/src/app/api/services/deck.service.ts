import { Injectable } from '@angular/core';

import { ApiService } from '../api.service';
import { DeckListResponse, DeckResponse } from '../interfaces/deck.interface';
import { Response } from '../interfaces/response.interface';
import { Card, Format, Archetype } from 'ptcg-server';
import { map } from 'rxjs/operators';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { FormatValidator } from 'src/app/util/formats-validator';


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

  public saveDeck(deckId: number, name: string, cards: string[], manualArchetype1?: Archetype, manualArchetype2?: Archetype) {
    return this.api.post<DeckResponse>('/v1/decks/save', {
      id: deckId,
      name,
      cards,
      manualArchetype1,
      manualArchetype2
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

}
