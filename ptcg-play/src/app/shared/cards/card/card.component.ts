import { Component, Input } from '@angular/core';
import { Card } from 'ptcg-server';
import { CardsBaseService } from '../cards-base.service';

@Component({
  selector: 'ptcg-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  exportAs: 'ptcgCard',
  template: `
    <div class="card" 
         [@cardMove]
         [@cardFlip]="isFaceUp ? 'front' : 'back'"
         (@cardMove.done)="onAnimationComplete($event)">
      <img [src]="cardImage" [alt]="card.name">
    </div>
  `
})
export class CardComponent {
  public scanUrl: string;
  public data: Card;

  @Input() cardback = false;
  @Input() placeholder = false;
  @Input() customImageUrl: string;
  @Input() isFaceUp: boolean = true;
  @Input() set card(value: Card) {
    this.data = value;
    this.scanUrl = this.customImageUrl || this.cardsBaseService.getScanUrl(this.data);
  }

  onAnimationComplete(event: AnimationEvent): void {
    // Handle animation completion if needed
  }

  constructor(private cardsBaseService: CardsBaseService) { }
}
