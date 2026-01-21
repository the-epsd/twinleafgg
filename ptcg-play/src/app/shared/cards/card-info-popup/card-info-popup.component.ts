import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Card, CardList, Player } from 'ptcg-server';
import { CardInfoPaneOptions, CardInfoPaneAction } from '../card-info-pane/card-info-pane.component';
import { CardListPopupComponent, CardListPopupData } from '../card-list-popup/card-list-popup.component';

export interface CardInfoPopupData {
  card?: Card;
  cardList?: CardList;
  options?: CardInfoPaneOptions;
  allowReveal?: boolean;
  facedown?: boolean;
  players?: Player[];
}

@Component({
  selector: 'ptcg-card-info-popup',
  templateUrl: './card-info-popup.component.html',
  styleUrls: ['./card-info-popup.component.scss']
})
export class CardInfoPopupComponent {

  public card: Card;
  public cardList: CardList;
  public facedown: boolean;
  public allowReveal: boolean;
  public options: CardInfoPaneOptions;
  public players: Player[];
  private data: CardInfoPopupData;

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CardInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardInfoPopupData,
  ) {
    this.data = data;
    this.card = data.card;
    this.cardList = data.cardList;
    this.facedown = data.facedown;
    this.allowReveal = data.allowReveal;
    this.options = data.options || {};
    this.players = data.players || [];
  }

  public async showCardList(): Promise<void> {
    const data: CardListPopupData = {
      card: this.card,
      cardList: this.cardList,
      facedown: this.facedown
    };

    const dialog = this.dialog.open(CardListPopupComponent, {
      maxWidth: '100%',
      width: '670px',
      data
    });

    const card = await dialog.afterClosed().toPromise();
    if (card !== undefined) {
      this.card = card;
    }
  }

  public close(result?: CardInfoPaneAction) {
    this.dialogRef.close(result);
  }

  public onCardSwap(event: { originalCard: Card, replacementCard: Card }) {
    // Update the card reference to show the swapped card
    this.card = event.replacementCard;

    // If there's a cardList, we might need to update it too
    if (this.cardList && this.cardList.cards) {
      const index = this.cardList.cards.findIndex(c => c.fullName === event.originalCard.fullName);
      if (index !== -1) {
        this.cardList.cards[index] = event.replacementCard;
      }
    }

    // Emit the swap event to parent (e.g., deck editor) so it can update the deck
    this.dialogRef.close({ cardSwap: event });
  }

}
