import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Card, SuperType } from 'ptcg-server';
import { CardsBaseService } from '../cards-base.service';

export interface CardSwapDialogData {
  currentCard: Card;
  alternativeCards: Card[];
}

@Component({
  selector: 'ptcg-card-swap-dialog',
  templateUrl: './card-swap-dialog.component.html',
  styleUrls: ['./card-swap-dialog.component.scss']
})
export class CardSwapDialogComponent {

  constructor(
    public matDialogRef: MatDialogRef<CardSwapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardSwapDialogData,
    private cardsBaseService: CardsBaseService
  ) {
  }

  onCardSelected(card: Card) {
    this.matDialogRef.close({ selectedCard: card });
  }

  onCancel() {
    this.matDialogRef.close();
  }

  isFavoriteCard(card: Card): boolean {
    return this.cardsBaseService.isFavoriteCard(card);
  }

  toggleFavorite(card: Card, event: Event) {
    event.stopPropagation();
    if (this.isFavoriteCard(card)) {
      this.cardsBaseService.clearFavoriteCard(card.name);
    } else {
      this.cardsBaseService.setFavoriteCard(card.name, card.fullName);
    }
  }

  isPokemonCard(card: Card): boolean {
    return card.superType === SuperType.POKEMON;
  }
}
