import { Injectable } from '@angular/core';
import { Card, StateSerializer, SuperType, PokemonCard, EnergyCard, CardType, TrainerCard, CardsInfo, CardManager } from 'ptcg-server';

import { ApiService } from '../../api/api.service';
import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneAction } from './card-info-pane/card-info-pane.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../session/session.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService {

  private cards: Card[] = [];
  private names: string[] = [];
  private cardManager: CardManager;
  private customImages: { [key: string]: string } = {};
  private globalArtworksMap: { [code: string]: string } = {};

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private sessionService: SessionService,
    private http: HttpClient
  ) {
    this.cardManager = CardManager.getInstance();
    this.loadCustomImages();
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardManager.loadCardsInfo(cardsInfo);
    this.cards = this.cardManager.getAllCards().slice();
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  public setCards(cards: Card[]) {
    this.cards = cards;
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  private compareCards(c1: Card, c2: Card) {
    if (c1.superType !== c2.superType) {
      return c1.superType - c2.superType;
    }
    switch (c1.superType) {
      case SuperType.POKEMON:
        const p1 = c1 as PokemonCard;
        const p2 = c2 as PokemonCard;
        if (p2.cardType !== p1.cardType) {
          return p1.cardType - p2.cardType;
        }
        break;
      case SuperType.ENERGY:
        const e1 = c1 as EnergyCard;
        const e2 = c2 as EnergyCard;
        if (e1.energyType !== e2.energyType) {
          return e1.energyType - e2.energyType;
        }
        const type1 = e1.provides.length > 0 ? e1.provides[0] : CardType.NONE;
        const type2 = e2.provides.length > 0 ? e2.provides[0] : CardType.NONE;
        if (type1 !== type2) {
          return type1 - type2;
        }
        break;
      case SuperType.TRAINER:
        const t1 = c1 as TrainerCard;
        const t2 = c2 as TrainerCard;
        if (t1.trainerType !== t2.trainerType) {
          return t1.trainerType - t2.trainerType;
        }
    }
    return c1.fullName < c2.fullName ? -1 : 1;
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardNames(): string[] {
    return this.names;
  }

  private loadCustomImages(): void {
    const storedImages = localStorage.getItem('customCardImages');
    if (storedImages) {
      this.customImages = JSON.parse(storedImages);
    }
  }

  public getScanUrl(card: Card): string {
    const fullCardIdentifier = `${card.set} ${card.setNumber}`;
    const customUrl = this.customImages[fullCardIdentifier];
    if (customUrl) {
      return customUrl;
    }

    const config = this.sessionService.session.config;
    const scansUrl = config && config.scansUrl || '';
    return scansUrl
      .replace('{cardImage}', card.cardImage)
      .replace('{setNumber}', card.setNumber)
      .replace('{name}', card.fullName);
  }

  public setGlobalArtworksMap(map: { [code: string]: string } | undefined): void {
    this.globalArtworksMap = map || {};
  }

  public getGlobalArtworkUrl(fullName: string): string | undefined {
    return this.globalArtworksMap ? this.globalArtworksMap[fullName] : undefined;
  }

  public getScanUrlWithArt(card: Card, artworksSelection?: { code: string; artworkId?: number }[], unlocked?: { id: number, imageUrl: string }[]): string {
    // If player selected an alternate art for this card, find it among unlocked and return its image
    if (artworksSelection && unlocked) {
      const code = card.fullName;
      const selected = artworksSelection.find(a => a.code === code && a.artworkId);
      if (selected) {
        const art = unlocked.find(u => u.id === selected.artworkId);
        if (art && art.imageUrl) return art.imageUrl;
      }
    }
    return this.getScanUrl(card);
  }

  public setScanUrl(jsonUrl: string): Observable<void> {
    return this.http.get(jsonUrl).pipe(
      map((json: any) => {
        this.customImages = json;
        localStorage.setItem('customCardImages', JSON.stringify(this.customImages));
      }),
    );
  }


  public getCardByName(cardName: string): Card | undefined {
    return this.cards.find(c => c.fullName === cardName);
  }

  public getCardByNameSetNumber(name: string, set: string, setNumber: string): Card | undefined {
    return this.cards.find(c => c.name === name && c.set === set && c.setNumber === setNumber);
  }

  public showCardInfo(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    // If caller passed a plain mapping to simulate artworksMap, wrap it into an object with artworksMap
    const maybeMap = data.cardList as any;
    if (maybeMap && !('cards' in maybeMap) && typeof maybeMap === 'object') {
      data.cardList = { cards: [data.card], artworksMap: maybeMap } as any;
    }
    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  public showCardInfoList(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    if (data.cardList === undefined) {
      return this.showCardInfo(data);
    }

    const dialog = this.dialog.open(CardInfoListPopupComponent, {
      maxWidth: '100%',
      width: '670px',
      data
    });

    return dialog.afterClosed().toPromise()
      .catch(() => undefined);
  }

  public getArtworkUrl(card: Card, artwork?: { imageUrl: string }): string {
    if (artwork && artwork.imageUrl) {
      return artwork.imageUrl;
    }
    return this.getScanUrl(card);
  }

}
