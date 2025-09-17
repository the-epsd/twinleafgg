import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DragSource } from '@ng-dnd/core';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { DeckItem } from './deck-card.interface';
import { MatDialog } from '@angular/material/dialog';
import { exhaustMap, filter, tap } from 'rxjs/operators';
import { DeckCardDialogComponent } from '../deck-card-dialog/deck-card-dialog.component';
import { Subject, merge } from 'rxjs';
import { Card } from 'ptcg-server';

export const DeckCardType = 'DECK_CARD';

@Component({
  selector: 'ptcg-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: ['./deck-card.component.scss']
})
export class DeckCardComponent implements OnDestroy {

  public showButtons = false;

  @Input() source: DragSource<DeckItem, any>;
  @Input() card: DeckItem;
  @Input() showCardCount: boolean;
  @Input() isLibraryCard: boolean = false;
  @Input() customImageUrl: string; // legacy base-image override (rare)
  @Input() customArtworkUrl: string; // overlay artwork for selected art in deck editor
  @Input() artworksContext: any;

  @Output() cardSelected = new EventEmitter<{ card: Card, action: 'add' | 'replace' }>();
  @Output() countClick = new EventEmitter<void>();
  @Output() infoClick = new EventEmitter<void>();
  @Output() addCard = new EventEmitter<void>();
  @Output() removeCard = new EventEmitter<void>();

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

  showCardInfo() {
    const overlayMap = this.customArtworkUrl
      ? { [this.card.card.fullName]: { imageUrl: this.customArtworkUrl } }
      : undefined;
    const ctx = (overlayMap as any) || (this.artworksContext as any);
    this.cardsBaseService.showCardInfo({ card: this.card.card, cardList: ctx });
  }
}
