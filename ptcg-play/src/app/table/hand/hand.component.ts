import { Component, ElementRef, HostBinding, Input, OnChanges, OnDestroy } from '@angular/core';
import { Player, Card, CardList, CardTarget, PlayerType, SlotType } from 'ptcg-server';
import { SortableSpec, DraggedItem } from '@ng-dnd/sortable';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { HandItem, HandCardType } from './hand-item.interface';
import { LocalGameState } from '../../shared/session/session.interface';
import { GameService } from '../../api/services/game.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ptcg-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  animations: [
    trigger('cardDrag', [
      state('dragging', style({
        position: 'fixed',
        zIndex: 1000,
        pointerEvents: 'none',
        transform: 'rotate(5deg) scale(1.05)'
      })),
      transition('* => dragging', animate('100ms ease-out')),
      transition('dragging => *', animate('150ms ease-in'))
    ])
  ]
})
export class HandComponent implements OnChanges {

  public readonly handListId = 'HAND_LIST';

  @Input() player: Player;
  @Input() gameState: LocalGameState;
  @Input() clientId: number;
  @Input() isOpponent: boolean = false;
  @Input() isAdmin: boolean = false;
  @Input() isTO: boolean = false;

  public cards: Card[] = [];
  public isFaceDown: boolean;
  public isDeleted: boolean;
  public handSpec: SortableSpec<HandItem> = {
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
  public list: HandItem[] = [];
  public tempList: HandItem[] = [];
  private draggingCard: Card | null = null;
  private isOwner: boolean;

  private dragVelocity = { x: 0, y: 0 };
  private lastDragPosition = { x: 0, y: 0 };
  private dragStartTime = 0;
  private dragElement: HTMLElement | null = null;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService,
    private elementRef: ElementRef
  ) {
  }

  isDragging(card: Card): boolean {
    return this.draggingCard === card;
  }

  onDragStart(card: Card, event: DragEvent): void {
    this.draggingCard = card;
    this.dragStartTime = performance.now();
    this.lastDragPosition = { x: event.clientX, y: event.clientY };
    this.dragVelocity = { x: 0, y: 0 };
    this.dragElement = event.target as HTMLElement;
  }

  onDragMove(event: MouseEvent): void {
    if (!this.draggingCard || !this.dragElement) return;

    const currentTime = performance.now();
    const deltaTime = currentTime - this.dragStartTime;

    if (deltaTime > 0) {
      const currentPosition = { x: event.clientX, y: event.clientY };
      this.dragVelocity = {
        x: (currentPosition.x - this.lastDragPosition.x) / deltaTime,
        y: (currentPosition.y - this.lastDragPosition.y) / deltaTime
      };
      this.lastDragPosition = currentPosition;

      // Calculate rotation based on drag direction
      const angle = Math.atan2(
        currentPosition.y - this.lastDragPosition.y,
        currentPosition.x - this.lastDragPosition.x
      ) * (180 / Math.PI);

      // Calculate scale based on drag speed
      const speed = Math.sqrt(
        Math.pow(this.dragVelocity.x, 2) +
        Math.pow(this.dragVelocity.y, 2)
      );
      const scale = 1 + Math.min(speed * 0.001, 0.15);

      // Apply transform
      this.dragElement.style.transform = `
        translate(${currentPosition.x}px, ${currentPosition.y}px)
        rotate(${angle}deg)
        scale(${scale})
      `;
    }
  }

  onDragEnd(card: Card): void {
    this.draggingCard = null;
    this.dragElement = null;
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

      // Show hands for admins only when they are observers
      const isPlaying = this.gameState.state.players.some(p => p.id === this.clientId);
      const isObserver = !isPlaying;
      this.isFaceDown = hand.isSecret || (!hand.isPublic && !this.isOwner && (!isObserver || !this.isAdmin || !this.isTO));
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