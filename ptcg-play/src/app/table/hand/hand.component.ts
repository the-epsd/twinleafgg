import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { Player, Card, CardList, SuperType } from 'ptcg-server';

import { SortableSpec, DraggedItem } from '@ng-dnd/sortable';

import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { HandItem, HandCardType } from './hand-item.interface';
import { LocalGameState } from '../../shared/session/session.interface';
import { GameService } from '../../api/services/game.service';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnChanges {
  @HostBinding('style.--card-padding') cardPadding: number;
  public readonly handListId = 'HAND_LIST';

  @Input() player: Player;
  @Input() gameState: LocalGameState;
  @Input() clientId: number;

  public cards: Card[] = [];
  public isFaceDown: boolean;
  public isDeleted: boolean;
  public handSpec: SortableSpec<HandItem>;
  public list: HandItem[] = [];
  public tempList: HandItem[] = [];

  private isOwner: boolean;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) {
    this.handSpec = {
      type: HandCardType,
      trackBy: item => item.index,
      hover: item => {
        this.tempList = this.move(item);
      },
      drop: item => {
        this.tempList = this.move(item);
        this.list = this.tempList;
        this.dispatchAction(this.list);
      },
      canDrag: () => {
        const isMinimized = this.gameState && this.gameState.promptMinimized;
        return this.isOwner && !this.isDeleted && !isMinimized;
      },
      endDrag: () => {
        this.tempList = this.list;
      }
    };
  }

  ngOnChanges() {
    if (this.gameState) {
      this.isDeleted = this.gameState.deleted;
    }

    if (this.player) {
      const hand = this.player.hand;
      this.isOwner = this.player.id === this.clientId;
      this.cards = hand.cards;
      this.list = this.buildHandList(hand);
      this.tempList = this.list;
      this.isFaceDown = hand.isSecret || (!hand.isPublic && !this.isOwner);
    } else {
      this.cards = [];
      this.list = [];
      this.tempList = [];
    }
  }
  

  public showCardInfo(card: Card) {
    const facedown = this.isFaceDown;
    const allowReveal = facedown && !!this.gameState.replay;
    this.cardsBaseService.showCardInfo({ card, allowReveal, facedown });
  }

  private dispatchAction(list: HandItem[]) {
    if (!this.gameState) {
      return;
    }
    const order = list.map(i => i.index);
    this.gameService.reorderHandAction(this.gameState.gameId, order);
  }

  private move(item: DraggedItem<HandItem>) {
    const temp = this.list.slice();
    temp.splice(item.index, 1);
    temp.splice(item.hover.index, 0, item.data);
    return temp;
  }

//   private buildHandList(cards: CardList): HandItem[] {
//     const groupedCards = cards.cards.reduce((acc, card) => {
//       const name = card.name;
//       if (!acc[name]) {
//         acc[name] = [];
//       }
//       acc[name].push(card);
//       return acc;
//     }, {} as { [key: string]: Card[] });

//     const handItems: HandItem[] = [];

//     for (const [name, group] of Object.entries(groupedCards)) {
//       const item: HandItem = {
//         card: group[0],
//         index: handItems.length,
//         scanUrl: this.cardsBaseService.getScanUrl(group[0]),
//         count: group.length
//       };
//       handItems.push(item);
//     }

//     return handItems;
//   }
// }


private buildHandList(cards: CardList): HandItem[] {
  const sortedCards = cards.cards.slice().sort((a, b) => {
    // First, sort by superType
    const superTypeDiff = a.superType - b.superType;
    if (superTypeDiff !== 0) {
      return superTypeDiff;
    }

    // If superTypes are the same, sort by name
    return a.name.localeCompare(b.name);
  });

  return sortedCards.map((card, index) => {
    const item: HandItem = {
      card,
      index,
      scanUrl: this.cardsBaseService.getScanUrl(card)
    };
    return item;
  });
}
}