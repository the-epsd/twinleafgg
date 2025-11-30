import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'ptcg-server';

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
    @Inject(MAT_DIALOG_DATA) public data: CardSwapDialogData
  ) {
  }

  onCardSelected(card: Card) {
    this.matDialogRef.close({ selectedCard: card });
  }

  onCancel() {
    this.matDialogRef.close();
  }
}
