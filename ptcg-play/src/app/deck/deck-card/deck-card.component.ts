import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DragSource } from '@ng-dnd/core';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckItem } from './deck-card.interface';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { exhaustMap, filter, tap } from 'rxjs/operators';
import { DeckCardDialogComponent } from '../deck-card-dialog/deck-card-dialog.component';
import { Subject, merge } from 'rxjs';
import { Card, CardType, EnergyCard, PokemonCard, SuperType } from 'ptcg-server';

export const DeckCardType = 'DECK_CARD';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnDestroy {

  public showButtons = false;
  public SuperType = SuperType;

  @Input() source: DragSource<DeckItem, any>;
  @Input() card: DeckItem;
  @Input() showCardCount: boolean;
  @Input() isLibraryCard: boolean = false;
  /** When true (e.g. set filter active in deck builder), show elemental type icon on library cards. */
  @Input() showLibraryTypeBadge: boolean = false;
  @Input() customImageUrl: string; // legacy base-image override (rare)
  @Input() customArtworkUrl: string; // overlay artwork for selected art in deck editor
  @Input() artworksContext: any;

  @Output() cardSelected = new EventEmitter<{ card: Card, action: 'add' | 'replace' }>();
  @Output() countClick = new EventEmitter<void>();
  @Output() infoClick = new EventEmitter<void>();
  @Output() addCard = new EventEmitter<void>();
  @Output() removeCard = new EventEmitter<void>();
  @Output() favoriteToggled = new EventEmitter<void>();

  showCardDialog = new Subject();
  showCardDialog$ = this.showCardDialog.asObservable();

  onShowCardDialog$ = this.showCardDialog$.pipe(
    exhaustMap(() => this.matDialog.open(DeckCardDialogComponent, {
      data: this.card,
      minHeight: '80vh',
      minWidth: '80vw'
    }).afterClosed()),
    filter(result => !!result),
    tap(card => this.cardSelected.emit(card))
  );

  subscription = merge(
    this.onShowCardDialog$
  ).subscribe();

  constructor(
    private matDialog: MatDialog,
    private cardsBaseService: CardsBaseService
  ) { }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCountClick(event: MouseEvent) {
    event.stopPropagation();
    this.countClick.next();
  }

  onAddCard(event: MouseEvent) {
    event.stopPropagation();
    this.addCard.next();
  }

  onRemoveCard(event: MouseEvent) {
    event.stopPropagation();
    this.removeCard.next();
  }

  async showCardInfo() {
    const overlayMap = this.customArtworkUrl
      ? { [this.card.card.fullName]: { imageUrl: this.customArtworkUrl } }
      : undefined;
    const ctx = (overlayMap as any) || (this.artworksContext as any);
    const result = await this.cardsBaseService.showCardInfo({ card: this.card.card, cardList: ctx });

    // Handle card swap event
    if (result && (result as any).cardSwap) {
      const swapEvent = (result as any).cardSwap;
      this.cardSelected.emit({ card: swapEvent.replacementCard, action: 'replace' });
    }
  }

  public isFavoriteCard(): boolean {
    if (!this.card || !this.card.card) {
      return false;
    }
    return this.cardsBaseService.isFavoriteCard(this.card.card);
  }

  get libraryTypeOverlayStyle(): Record<string, string> | null {
    if (!this.isLibraryCard || !this.showLibraryTypeBadge || !this.card?.card) {
      return null;
    }
    const pos = this.cardTypeToSpritePosition(this.resolveCardTypeForBadge(this.card.card));
    if (!pos) {
      return null;
    }
    return {
      background: `transparent url(/assets/type-icons-small.png) ${pos} no-repeat`,
    };
  }

  private resolveCardTypeForBadge(card: Card): CardType | null {
    if (card.superType === SuperType.POKEMON) {
      return (card as PokemonCard).cardType;
    }
    if (card.superType === SuperType.ENERGY) {
      const energy = card as EnergyCard;
      return energy.provides?.length ? energy.provides[0] : null;
    }
    return null;
  }

  /** Background positions must match `type-icons.component.html` (type-icons-small.png). */
  private cardTypeToSpritePosition(cardType: CardType): string | null {
    switch (cardType) {
      case CardType.GRASS:
        return '-156px -7px';
      case CardType.FIRE:
        return '-82px -7px';
      case CardType.WATER:
        return '-119px -7px';
      case CardType.LIGHTNING:
        return '-9px -7px';
      case CardType.PSYCHIC:
        return '-156px -47px';
      case CardType.FIGHTING:
        return '-9px -47px';
      case CardType.DARK:
        return '-45px -47px';
      case CardType.METAL:
        return '-82px -47px';
      case CardType.COLORLESS:
        return '-45px -7px';
      case CardType.FAIRY:
        return '-82px -88px';
      case CardType.DRAGON:
        return '-119px -47px';
      default:
        return null;
    }
  }

  public toggleFavorite(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.card || !this.card.card) {
      return;
    }

    if (this.isFavoriteCard()) {
      this.cardsBaseService.clearFavoriteCard(this.card.card.name);
    } else {
      this.cardsBaseService.setFavoriteCard(this.card.card.name, this.card.card.fullName);
    }

    // Notify parent to refresh library
    this.favoriteToggled.emit();
  }
}
