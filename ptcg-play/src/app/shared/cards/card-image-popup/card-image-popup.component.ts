import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Card } from 'ptcg-server';
import { CardsBaseService } from '../cards-base.service';

@Component({
  selector: 'ptcg-card-image-popup',
  templateUrl: './card-image-popup.component.html',
  styleUrls: ['./card-image-popup.component.scss']
})
export class CardImagePopupComponent {

  public card: Card;
  public facedown: boolean;
  public customImageUrl: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) data: { card: Card, facedown: boolean, customImageUrl?: string },
    private cardsBaseService: CardsBaseService,
  ) {
    this.card = data.card;
    this.facedown = data.facedown;
    this.customImageUrl = data.customImageUrl ?? this.cardsBaseService.getCustomImageOverrideForCard(data.card) ?? '';
  }

  public onUrlInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.customImageUrl = target?.value || '';
  }

  public isValidUrl(url: string): boolean {
    if (!url) { return false; }
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  public saveUrlOverride(): void {
    if (this.isValidUrl(this.customImageUrl)) {
      this.cardsBaseService.setCustomImageForCard(this.card, this.customImageUrl);
    }
  }

  public resetUrlOverride(): void {
    this.customImageUrl = '';
    this.cardsBaseService.clearCustomImageForCard(this.card);
  }

}
