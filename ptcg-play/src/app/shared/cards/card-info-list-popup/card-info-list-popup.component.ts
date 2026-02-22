import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Card, CardList, SuperType, Player } from 'ptcg-server';
import { CardInfoPaneOptions, CardInfoPaneAction } from '../card-info-pane/card-info-pane.component';
import { CardInfoPopupData, CardInfoPopupComponent } from '../card-info-popup/card-info-popup.component';


@Component({
  selector: 'ptcg-card-info-list-popup',
  templateUrl: './card-info-list-popup.component.html',
  styleUrls: ['./card-info-list-popup.component.scss']
})
export class CardInfoListPopupComponent {

  public card: Card;
  public cardList: CardList;
  public facedown: boolean;
  public allowReveal: boolean;
  public options: CardInfoPaneOptions;
  public players: Player[];
  public sortDiscards: boolean = false;
  private originalDiscard: Card[] = [];

  constructor(
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CardInfoListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: CardInfoPopupData,
  ) {
    this.card = data.card;
    this.cardList = data.cardList;
    this.allowReveal = data.allowReveal;
    this.facedown = data.facedown;
    this.options = data.options;
    this.players = data.players || [];
    this.originalDiscard = this.cardList.cards.slice(); // Clone discard pile
  }

  public async showCardInfo(card: Card): Promise<void> {
    this.card = card;

    const data: CardInfoPopupData = {
      card,
      facedown: this.facedown,
      options: this.options,
      players: this.players
    };

    const dialog = this.dialog.open(CardInfoPopupComponent, {
      maxWidth: '100%',
      width: '650px',
      data
    });

    const action = await dialog.afterClosed().toPromise();
    if (action) {
      this.close(action);
    }
  }

  public close(result?: CardInfoPaneAction) {
    this.dialogRef.close(result);
  }

  private getSortedCards(): Card[] {
    return this.cardList.cards.slice().sort((a, b) => {
      const typeOrder = (card: Card): number => {
        if (card.superType === SuperType.POKEMON) return 0;
        if (card.superType === SuperType.TRAINER) return 1;
        return 2;
      };

      const aType = typeOrder(a);
      const bType = typeOrder(b);
      if (aType !== bType) return aType - bType;
      if (a.set !== b.set) return a.set.localeCompare(b.set);
      return (parseInt(a.setNumber || '0', 10) - parseInt(b.setNumber || '0', 10));
    });
  }

  public onSortDiscardsChange(): void {
    if (this.sortDiscards) {
      const sorted = this.getSortedCards();
      this.cardList.cards = sorted;
    } else {
      this.cardList.cards = this.originalDiscard.slice(); // Restore discard order
    }
  }
}
