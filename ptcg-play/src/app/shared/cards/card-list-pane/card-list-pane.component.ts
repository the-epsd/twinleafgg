import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CardList, Card } from 'ptcg-server';

@Component({
  selector: 'ptcg-card-list-pane',
  templateUrl: './card-list-pane.component.html',
  styleUrls: ['./card-list-pane.component.scss']
})
export class CardListPaneComponent {

  @Input() cardList: CardList;
  @Input() selected: Card | undefined;
  @Input() facedown: boolean;
  @Output() cardClick = new EventEmitter<Card>();

  constructor() { }

  selectCard(card: Card) {
    this.cardClick.next(card);
  }

  get allCards(): Card[] {
    if (!this.cardList) return [];
    // Check if cardList has a 'tools' property (for PokemonCardList), otherwise just return cards
    const tools = (this.cardList as any).tools || [];
    return [...this.cardList.cards, ...tools];
  }

}
