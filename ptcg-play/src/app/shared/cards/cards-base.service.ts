import { Injectable, OnDestroy } from '@angular/core';
import { Card, StateSerializer, SuperType, PokemonCard, EnergyCard, CardType, TrainerCard, CardsInfo, CardManager } from 'ptcg-server';

import { ApiService } from '../../api/api.service';
import { CardInfoPopupData, CardInfoPopupComponent } from './card-info-popup/card-info-popup.component';
import { CardInfoListPopupComponent } from './card-info-list-popup/card-info-list-popup.component';
import { CardInfoPaneAction } from './card-info-pane/card-info-pane.component';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SessionService } from '../session/session.service';
import { Observable, Subject, Subscription, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FavoritesService } from '../../api/services/favorites.service';
import { ProfileService } from '../../api/services/profile.service';
import { CardArtwork } from '../../api/interfaces/cards.interface';

@Injectable({
  providedIn: 'root'
})
export class CardsBaseService implements OnDestroy {

  private cards: Card[] = [];
  private names: string[] = [];
  private cardIndex = new Map<string, Card>();
  private cardManager: CardManager;
  private customImages: { [key: string]: string } = {};
  private localOverrides: { [key: string]: string } = {};
  private nightlyImages: { [key: string]: string } = {};
  private favoriteCards: { [cardName: string]: string } = {};
  private unlockedArtworks: CardArtwork[] = [];

  private overridesChangedSubject = new Subject<string>();
  public overridesChanged$ = this.overridesChangedSubject.asObservable();
  private globalArtworksMap: { [code: string]: string } = {};
  private favoritesSubscription: Subscription | null = null;
  private cardImagesSubscription: Subscription | null = null;
  private nightlyImagesSubscription: Subscription | null = null;

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private sessionService: SessionService,
    private http: HttpClient,
    private favoritesService: FavoritesService,
    private profileService: ProfileService
  ) {
    this.cardManager = CardManager.getInstance();
    this.loadLocalOverrides();
    this.loadCustomImages();
    this.loadFavoriteCards();
    this.loadNightlyImages();
    this.setupFavoritesSubscription();
    this.setupCardImagesSubscription();
    this.setupNightlyImagesSubscription();
  }

  public loadCardsInfo(cardsInfo: CardsInfo) {
    this.cardManager.loadCardsInfo(cardsInfo);
    this.cards = this.cardManager.getAllCards().slice();
    this.rebuildCardIndex();
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  public setCards(cards: Card[]) {
    this.cards = cards;
    this.rebuildCardIndex();
    this.names = this.cards.map(c => c.fullName);
    this.cards.sort(this.compareCards);
    StateSerializer.setKnownCards(this.cards);
  }

  private rebuildCardIndex(): void {
    this.cardIndex.clear();
    for (const card of this.cards) {
      this.cardIndex.set(card.fullName, card);
      const p = card as any;
      if (p.legacyFullName) {
        this.cardIndex.set(p.legacyFullName, card);
      }
    }
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

  private getCardIdentifier(card: Card): string {
    return `${card.set} ${card.setNumber}`;
  }

  private getAltIdentifier(card: Card): string {
    return `${card.set} ${(card.setNumber || '').padStart(3, '0')}`;
  }

  private loadLocalOverrides(): void {
    const stored = localStorage.getItem('customCardImageOverrides');
    if (stored) {
      this.localOverrides = JSON.parse(stored);
    } else {
      this.localOverrides = {};
    }
  }

  private loadCustomImages(): void {
    if (this.isAuthenticated()) {
      this.loadCustomImagesFromAPI();
    } else {
      const storedImages = localStorage.getItem('customCardImages');
      if (storedImages) {
        this.customImages = JSON.parse(storedImages);
      }
      this.loadLocalOverrides();
    }
  }

  private loadCustomImagesFromAPI(): void {
    this.profileService.getCardImagesUrl().pipe(
      catchError(() => {
        // If API fails, fall back to localStorage
        const storedImages = localStorage.getItem('customCardImages');
        if (storedImages) {
          this.customImages = JSON.parse(storedImages);
        }
        this.loadLocalOverrides();
        return of({ ok: false, jsonUrl: '' });
      }),
      switchMap(response => {
        const jsonUrl = response.jsonUrl;
        if (jsonUrl && jsonUrl.trim()) {
          // Fetch and parse the JSON from the URL
          return this.http.get(jsonUrl).pipe(
            map((json: any) => {
              this.customImages = json;
              // Also save to localStorage as backup
              localStorage.setItem('customCardImages', JSON.stringify(this.customImages));
              this.loadLocalOverrides();
              return json;
            }),
            catchError(() => {
              // If fetching JSON fails, try localStorage
              const storedImages = localStorage.getItem('customCardImages');
              if (storedImages) {
                this.customImages = JSON.parse(storedImages);
              }
              this.loadLocalOverrides();
              return of({});
            })
          );
        } else {
          // No URL saved, try localStorage
          const storedImages = localStorage.getItem('customCardImages');
          if (storedImages) {
            this.customImages = JSON.parse(storedImages);
          }
          this.loadLocalOverrides();
          return of({});
        }
      })
    ).subscribe();
  }

  private loadFavoriteCards(): void {
    if (this.isAuthenticated()) {
      this.loadFavoritesFromAPI();
    } else {
      const storedFavorites = localStorage.getItem('favoriteCards');
      if (storedFavorites) {
        this.favoriteCards = JSON.parse(storedFavorites);
      }
    }
  }

  private isAuthenticated(): boolean {
    const session = this.sessionService.session;
    return !!(session.authToken && session.loggedUserId);
  }

  private setupFavoritesSubscription(): void {
    // Subscribe to session changes to reload favorites when user logs in
    this.favoritesSubscription = this.sessionService.get(s => s.loggedUserId).subscribe(userId => {
      if (userId && this.isAuthenticated()) {
        this.loadFavoritesFromAPI();
      } else {
        // User logged out, clear API favorites and use localStorage
        this.favoriteCards = {};
        const storedFavorites = localStorage.getItem('favoriteCards');
        if (storedFavorites) {
          this.favoriteCards = JSON.parse(storedFavorites);
        }
      }
    });
  }

  private setupCardImagesSubscription(): void {
    // Subscribe to session changes to reload card images when user logs in
    this.cardImagesSubscription = this.sessionService.get(s => s.loggedUserId).subscribe(userId => {
      if (userId && this.isAuthenticated()) {
        this.loadCustomImagesFromAPI();
      } else {
        // User logged out, clear API images and use localStorage
        this.customImages = {};
        const storedImages = localStorage.getItem('customCardImages');
        if (storedImages) {
          this.customImages = JSON.parse(storedImages);
        }
        this.loadLocalOverrides();
      }
    });
  }

  private loadNightlyImages(): void {
    if (this.isAuthenticated()) {
      this.loadNightlyImagesFromAPI();
    } else {
      const storedImages = localStorage.getItem('nightlyCardImages');
      if (storedImages) {
        this.nightlyImages = JSON.parse(storedImages);
      }
    }
  }

  private loadNightlyImagesFromAPI(): void {
    this.profileService.getNightlyImagesUrl().pipe(
      catchError(() => {
        // If API fails, fall back to localStorage
        const storedImages = localStorage.getItem('nightlyCardImages');
        if (storedImages) {
          this.nightlyImages = JSON.parse(storedImages);
        }
        return of({ ok: false, jsonUrl: '' });
      }),
      switchMap(response => {
        const jsonUrl = response.jsonUrl;
        if (jsonUrl && jsonUrl.trim()) {
          // Fetch and parse the JSON from the URL
          return this.http.get(jsonUrl).pipe(
            map((json: any) => {
              this.nightlyImages = json;
              // Also save to localStorage as backup
              localStorage.setItem('nightlyCardImages', JSON.stringify(this.nightlyImages));
              return json;
            }),
            catchError(() => {
              // If fetching JSON fails, try localStorage
              const storedImages = localStorage.getItem('nightlyCardImages');
              if (storedImages) {
                this.nightlyImages = JSON.parse(storedImages);
              }
              return of({});
            })
          );
        } else {
          // No URL saved, try localStorage
          const storedImages = localStorage.getItem('nightlyCardImages');
          if (storedImages) {
            this.nightlyImages = JSON.parse(storedImages);
          }
          return of({});
        }
      })
    ).subscribe();
  }

  private setupNightlyImagesSubscription(): void {
    // Subscribe to session changes to reload nightly images when user logs in
    this.nightlyImagesSubscription = this.sessionService.get(s => s.loggedUserId).subscribe(userId => {
      if (userId && this.isAuthenticated()) {
        this.loadNightlyImagesFromAPI();
      } else {
        // User logged out, clear API images and use localStorage
        this.nightlyImages = {};
        const storedImages = localStorage.getItem('nightlyCardImages');
        if (storedImages) {
          this.nightlyImages = JSON.parse(storedImages);
        }
      }
    });
  }

  private loadFavoritesFromAPI(): void {
    this.favoritesService.getFavorites().pipe(
      catchError(() => {
        // If API fails, fall back to localStorage
        const storedFavorites = localStorage.getItem('favoriteCards');
        if (storedFavorites) {
          this.favoriteCards = JSON.parse(storedFavorites);
        }
        return of({});
      })
    ).subscribe(favorites => {
      this.favoriteCards = favorites;
    });
  }

  public setCustomImageForCard(card: Card, imageUrl: string): void {
    const fullCardIdentifier = this.getCardIdentifier(card);
    if (!imageUrl) {
      delete this.localOverrides[fullCardIdentifier];
    } else {
      this.localOverrides[fullCardIdentifier] = imageUrl;
    }
    localStorage.setItem('customCardImageOverrides', JSON.stringify(this.localOverrides));
    this.overridesChangedSubject.next(fullCardIdentifier);
  }

  public clearCustomImageForCard(card: Card): void {
    const fullCardIdentifier = this.getCardIdentifier(card);
    if (this.localOverrides[fullCardIdentifier]) {
      delete this.localOverrides[fullCardIdentifier];
      localStorage.setItem('customCardImageOverrides', JSON.stringify(this.localOverrides));
    }
    this.overridesChangedSubject.next(fullCardIdentifier);
  }

  public getCustomImageOverrideForCard(card: Card): string | undefined {
    if (!card?.set || !card?.setNumber) {
      return undefined;
    }
    const fullCardIdentifier = this.getCardIdentifier(card);
    let url = this.localOverrides[fullCardIdentifier];
    if (!url && card.setNumber) {
      url = this.localOverrides[this.getAltIdentifier(card)];
    }
    return url;
  }

  public getScanUrl(card: Card): string {
    // Don't generate URLs for Unknown cards to prevent revealing opponent's deck information
    if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') {
      return '';
    }

    // Validate card has required properties
    if (!card.set || !card.setNumber) {
      console.warn('Card missing set or setNumber:', card);
      // Still try to generate default URL if cardImage exists
      if (card.cardImage) {
        const config = this.sessionService.session.config;
        const scansUrl = config && config.scansUrl || '';
        return scansUrl
          .replace('{cardImage}', card.cardImage || '')
          .replace('{setNumber}', card.setNumber || '')
          .replace('{name}', card.fullName || '');
      }
      return '';
    }

    const fullCardIdentifier = this.getCardIdentifier(card);
    const altIdentifier = this.getAltIdentifier(card);

    // Check nightly images first
    let nightlyUrl = this.nightlyImages[fullCardIdentifier] ?? this.nightlyImages[altIdentifier];
    if (nightlyUrl) {
      return nightlyUrl;
    }

    // Then check local overrides (popup-only, takes precedence over base custom images)
    let overrideUrl = this.localOverrides[fullCardIdentifier] ?? this.localOverrides[altIdentifier];
    if (overrideUrl) {
      return overrideUrl;
    }

    // Then check base custom images (from JSON/API)
    let customUrl = this.customImages[fullCardIdentifier] ?? this.customImages[altIdentifier];
    if (customUrl) {
      return customUrl;
    }

    // Fall back to default URL template
    const config = this.sessionService.session.config;
    const scansUrl = config && config.scansUrl || '';
    if (!scansUrl) {
      return '';
    }
    return scansUrl
      .replace('{cardImage}', card.cardImage || '')
      .replace('{setNumber}', card.setNumber || '')
      .replace('{name}', card.fullName || '');
  }

  /**
   * Get scan URL for a card, checking for artwork overrides in the cardList's artworksMap first.
   * This matches the behavior of CardComponent's overlayUrl getter - if artworksMap has an entry,
   * use that imageUrl directly. Otherwise fall back to getScanUrl() to ensure identical behavior.
   * Used by 3D board components that need a single texture (can't use overlay like 2D components).
   * Priority order: artworksMap → nightly images → custom images → default URL
   */
  public getScanUrlFromCardList(card: Card, cardList?: any): string {
    // Don't generate URLs for Unknown cards
    if (!card || card.fullName === 'Unknown' || card.name === 'Unknown') {
      return '';
    }

    // 1. Check for artwork override in cardList's artworksMap first (player-selected artwork)
    if (cardList) {
      const artworksMap = (cardList as any).artworksMap as { [code: string]: { imageUrl: string } } | undefined;
      if (artworksMap && artworksMap[card.fullName]?.imageUrl) {
        return artworksMap[card.fullName].imageUrl;
      }
      // Also check if cardList itself is a map (fallback pattern from CardComponent)
      const map = cardList as any;
      if (map && map[card.fullName]?.imageUrl) {
        return map[card.fullName].imageUrl;
      }
    }

    // 2. If no artworksMap override, use getScanUrl() directly
    // Priority: nightly images → local overrides → base custom images → default URL
    return this.getScanUrl(card);
  }

  public getSleeveUrl(imagePath?: string): string | undefined {
    if (!imagePath) {
      return undefined;
    }
    const config = this.sessionService.session.config;
    const sleevesUrl = config && config.sleevesUrl || '';
    if (!sleevesUrl) {
      return undefined;
    }
    const apiUrl = this.apiService.getApiUrl();
    return apiUrl + sleevesUrl.replace('{path}', imagePath);
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
    // First save the URL to API if authenticated, then fetch and parse the JSON
    if (this.isAuthenticated()) {
      return this.profileService.setCardImagesUrl(jsonUrl).pipe(
        catchError(() => {
          // If API fails, continue anyway and save to localStorage
          return of({ ok: false });
        }),
        switchMap(() => {
          // Fetch and parse the JSON from the URL
          return this.http.get(jsonUrl).pipe(
            map((json: any) => {
              this.customImages = json;
              // Also save to localStorage as backup
              localStorage.setItem('customCardImages', JSON.stringify(this.customImages));
            }),
            catchError((error) => {
              // If fetching JSON fails, throw the error
              throw error;
            })
          );
        })
      );
    } else {
      // Not authenticated, use localStorage
      return this.http.get(jsonUrl).pipe(
        map((json: any) => {
          this.customImages = json;
          localStorage.setItem('customCardImages', JSON.stringify(this.customImages));
        }),
      );
    }
  }

  public setNightlyImagesUrl(jsonUrl: string): Observable<void> {
    // First save the URL to API (admin-only), then fetch and parse the JSON
    if (this.isAuthenticated()) {
      return this.profileService.setNightlyImagesUrl(jsonUrl).pipe(
        switchMap(() => {
          // Fetch and parse the JSON from the URL
          return this.http.get(jsonUrl).pipe(
            map((json: any) => {
              this.nightlyImages = json;
              // Also save to localStorage as backup
              localStorage.setItem('nightlyCardImages', JSON.stringify(this.nightlyImages));
            }),
            catchError((error) => {
              // If fetching JSON fails, throw the error
              throw error;
            })
          );
        })
      );
    } else {
      // Not authenticated, use localStorage
      return this.http.get(jsonUrl).pipe(
        map((json: any) => {
          this.nightlyImages = json;
          localStorage.setItem('nightlyCardImages', JSON.stringify(this.nightlyImages));
        }),
      );
    }
  }


  public getCardByName(cardName: string): Card | undefined {
    return this.cardIndex.get(cardName);
  }

  public getCardByNameSetNumber(name: string, set: string, setNumber: string): Card | undefined {
    return this.cards.find(c => c.name === name && c.set === set && c.setNumber === setNumber);
  }

  public getCardByNameSet(name: string, set: string): Card | undefined {
    return this.cards.find(c => c.name === name && c.set === set);
  }

  public getCardByBaseName(name: string): Card | undefined {
    return this.cards.find(c => c.name === name);
  }

  public showCardInfo(data: CardInfoPopupData = {}): Promise<CardInfoPaneAction> {
    // If caller passed a plain mapping to simulate artworksMap, wrap it into an object with artworksMap
    const maybeMap = data.cardList as any;
    if (maybeMap && !('cards' in maybeMap) && typeof maybeMap === 'object') {
      data.cardList = { cards: [data.card], artworksMap: maybeMap } as any;
    }
    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '50vw',
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

  public setFavoriteCard(cardName: string, fullName: string): void {
    this.favoriteCards[cardName] = fullName;

    if (this.isAuthenticated()) {
      // Save to database via API
      this.favoritesService.setFavorite(cardName, fullName).pipe(
        catchError(() => {
          // If API fails, fall back to localStorage
          localStorage.setItem('favoriteCards', JSON.stringify(this.favoriteCards));
          return of({ ok: false });
        })
      ).subscribe();
    } else {
      // Save to localStorage for unauthenticated users
      localStorage.setItem('favoriteCards', JSON.stringify(this.favoriteCards));
    }
  }

  public getFavoriteCard(cardName: string): string | undefined {
    return this.favoriteCards[cardName];
  }

  public clearFavoriteCard(cardName: string): void {
    if (this.favoriteCards[cardName]) {
      delete this.favoriteCards[cardName];

      if (this.isAuthenticated()) {
        // Clear from database via API
        this.favoritesService.clearFavorite(cardName).pipe(
          catchError(() => {
            // If API fails, fall back to localStorage
            localStorage.setItem('favoriteCards', JSON.stringify(this.favoriteCards));
            return of({ ok: false });
          })
        ).subscribe();
      } else {
        // Clear from localStorage for unauthenticated users
        localStorage.setItem('favoriteCards', JSON.stringify(this.favoriteCards));
      }
    }
  }

  public isFavoriteCard(card: Card): boolean {
    const favoriteFullName = this.favoriteCards[card.name];
    return favoriteFullName === card.fullName;
  }

  public setUnlockedArtworks(artworks: CardArtwork[]): void {
    this.unlockedArtworks = artworks || [];
  }

  public getUnlockedArtworks(): CardArtwork[] {
    return this.unlockedArtworks;
  }

  ngOnDestroy(): void {
    if (this.favoritesSubscription) {
      this.favoritesSubscription.unsubscribe();
    }
    if (this.cardImagesSubscription) {
      this.cardImagesSubscription.unsubscribe();
    }
    if (this.nightlyImagesSubscription) {
      this.nightlyImagesSubscription.unsubscribe();
    }
  }

}
