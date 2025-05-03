import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-card-image-popup',
  templateUrl: './card-image-popup.component.html',
  styleUrls: ['./card-image-popup.component.scss']
})
export class CardImagePopupComponent {

  public card: Card;
  public cardList: any;
  public facedown: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card: Card; cardList: any; facedown: boolean },
  ) {
    this.card = data.card;
    this.cardList = data.cardList;
    this.facedown = data.facedown;
    console.log('Dialog Data:', data);
  }
}