import { Component, HostBinding, Input, OnChanges } from '@angular/core';
import { Player, Card, CardList, CardTarget, PlayerType, SlotType } from 'ptcg-server';
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

  public readonly handListId = 'HAND_LIST';

  @Input() player: Player;
  @Input() gameState: LocalGameState;
  @Input() clientId: number;
  @Input() isOpponent: boolean = false;


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

  @HostBinding('style.--card-margin')
  get cardmargin(): string {
    return this.calculateContainerMargin();
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

  public onCardClick(card: Card, index: number) {
    if (!this.isOwner || this.isDeleted) {
      return this.showCardInfo(card);
    }

    const player = PlayerType.BOTTOM_PLAYER;
    const slot = SlotType.HAND;
    const target: CardTarget = { player, slot, index };

    const options = { enableAbility: { useFromHand: true }, enableAttack: false };
    this.cardsBaseService.showCardInfo({ card, options })
      .then(result => {
        if (!result) {
          return;
        }
        const gameId = this.gameState.gameId;

        if (result.ability) {
          this.gameService.ability(gameId, result.ability, target);
        }
      });
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

  private cardWidth = 88; // Adjust this value based on your card width
  private containerWidth = 1000; // Total width to fill

  calculateContainerMargin(): string {
    const totalCards = this.cards.length;
    const availableWidth = this.containerWidth - this.cardWidth; // Space for n-1 gaps

    if (totalCards <= 10) {
      return '3px';
    }

    const totalGapWidth = availableWidth - (totalCards - 1) * this.cardWidth;
    const margin = totalGapWidth / (totalCards - 1) / 2; // Divide by 2 for left and right margins

    return `${margin}px`;
  }

  private buildHandList(cards: CardList): HandItem[] {
    return cards.cards.map((card, index) => {
      const item: HandItem = {
        card,
        index,
        scanUrl: this.cardsBaseService.getScanUrl(card)
      };
      return item;
    });
  }

}