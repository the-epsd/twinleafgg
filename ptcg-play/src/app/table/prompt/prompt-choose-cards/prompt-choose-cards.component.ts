import { Component, Host, Input, Optional, OnInit } from '@angular/core';
import { Card, CardList, ChooseCardsPrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PromptComponent } from '../prompt.component';
import { PromptBaseComponent } from '../prompt-base/prompt-base.component';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptItem } from '../prompt-card-item.interface';

interface PromptCardItem extends PromptItem {
  showButtons?: boolean;
}

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent extends PromptBaseComponent implements OnInit {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.promptValue = prompt;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.allowedCancel = prompt.options.allowCancel;
    this.blocked = prompt.options.blocked;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.isSecret = prompt.options.isSecret;

    // Start with invalid state if min > 0
    this.isInvalid = prompt.options.min > 0;

    if (prompt.options.isSecret) {
      prompt.cards.cards.forEach((c, i) => {
        this.cardbackMap[i] = true;
      });
    }

    // Initialize card items
    this.initializeCardItems();
  }

  @Input() gameState: LocalGameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public blocked: number[];
  public isInvalid = false;
  public isSecret: boolean;
  public revealed = false;
  public cardbackMap: { [index: number]: boolean } = {};
  public promptValue: ChooseCardsPrompt;

  public currentTab = 'All';
  public filteredCards: Card[] = [];
  private result: number[] = [];

  // Carousel properties
  public promptItems: PromptCardItem[] = [];
  public visibleCards: PromptCardItem[] = [];
  public currentIndex = 0;
  public selectedCards: any[] = [];
  public filterMap: { [fullName: string]: boolean } = {};

  private lastWheelTime = 0;
  private readonly WHEEL_DELAY = 225; // milliseconds between wheel events

  constructor(
    gameService: GameService,
    private cardsBaseService: CardsBaseService,
    @Host() @Optional() parentPrompt: PromptComponent
  ) {
    super(gameService, parentPrompt);
  }

  ngOnInit() {
    if (this.cards && this.filter) {
      this.initializeCardItems();
    }
  }

  private initializeCardItems() {
    // Build filter map
    this.filterMap = this.buildFilterMap(this.cards.cards, this.filter, this.blocked || []);

    // Build card list
    this.promptItems = this.buildCardList(this.cards.cards);

    // Initialize visible cards with first card centered
    this.currentIndex = 0;
    this.updateVisibleCards();
  }

  private buildFilterMap(cards: Card[], filter: Partial<Card>, blocked: number[]) {
    const filterMap: { [fullName: string]: boolean } = {};

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      let isBlocked = blocked.includes(i);
      if (isBlocked === false) {
        for (const key in filter) {
          if (filter.hasOwnProperty(key)) {
            isBlocked = isBlocked || (filter as any)[key] !== (card as any)[key];
          }
        }
      }
      filterMap[card.fullName] = !isBlocked;
    }
    return filterMap;
  }

  private buildCardList(cards: Card[]): PromptCardItem[] {
    return cards.map((card, index) => {
      const item: PromptCardItem = {
        card,
        index,
        isAvailable: this.filterMap[card.fullName],
        isSecret: !!this.cardbackMap[index],
        scanUrl: this.cardsBaseService.getScanUrl(card),
        showButtons: false
      };
      return item;
    });
  }

  protected minimizeFallback() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.cancelWithAnimation(gameId, id);
  }

  public confirm() {
    if (this.isInvalid) {
      return;
    }

    const gameId = this.gameState.gameId;
    const id = this.promptId;

    // Use the result array which is kept in sync with selectedCards
    if (this.promptValue.validate(this.result.map(index => this.cards.cards[index]))) {
      this.confirmWithAnimation(gameId, id, this.result);
    }
  }

  // Carousel functionality
  public nextCards() {
    if (this.currentIndex < this.promptItems.length - 1) {
      this.currentIndex++;
      this.updateVisibleCards();
    }
  }

  public previousCards() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateVisibleCards();
    }
  }

  private updateVisibleCards() {
    const startIdx = Math.max(0, this.currentIndex);
    const endIdx = Math.min(this.promptItems.length, startIdx + 3);
    this.visibleCards = this.promptItems.slice(startIdx, endIdx);
  }

  public onWheel(event: WheelEvent) {
    // Prevent default scrolling behavior
    event.preventDefault();

    const now = Date.now();
    if (now - this.lastWheelTime < this.WHEEL_DELAY) {
      return; // Skip if not enough time has passed
    }

    this.lastWheelTime = now;

    // Determine scroll direction
    if (event.deltaY > 0) {
      // Scrolling down/right
      this.nextCards();
    } else if (event.deltaY < 0) {
      // Scrolling up/left
      this.previousCards();
    }
  }

  public toggleCardSelection(card: Card, index?: number) {
    if (!this.filterMap[card.fullName]) {
      return; // Card is unavailable
    }

    const cardIdx = this.selectedCards.findIndex(sc => sc.id === card.id);

    if (cardIdx === -1) {
      // Card is not selected, add it if we haven't reached max
      const maxCards = this.promptValue?.options?.max || 1;
      if (this.selectedCards.length < maxCards) {
        // Create a copy with the original index for reference
        const cardOriginalIndex = index !== undefined ? index :
          this.promptItems.findIndex(item => item.card.id === card.id);

        const selectedCard = {
          ...card,
          originalIndex: cardOriginalIndex,
          isSecret: this.promptValue?.options?.isSecret || false
        };

        this.selectedCards.push(selectedCard);
      }
    } else {
      // Card is already selected, remove it
      this.selectedCards.splice(cardIdx, 1);
    }

    // Update validity and result
    this.updateValidity();
  }

  public isCardSelected(card: Card): boolean {
    return this.selectedCards.some(sc => sc.id === card.id);
  }

  public showCardInfo(item: PromptCardItem) {
    const facedown = this.cardbackMap[item.index];
    this.cardsBaseService.showCardInfo({ card: item.card, facedown });
  }

  public getSlotArray(): number[] {
    const maxCards = this.promptValue?.options?.max || 1;
    return Array(maxCards).fill(0).map((_, i) => i);
  }

  private updateValidity() {
    const selectedIndices = this.selectedCards.map(card => card.originalIndex);
    const selectedCards = selectedIndices.map(index => this.cards.cards[index]);

    // Check min/max constraints
    const min = this.promptValue?.options?.min || 0;
    const max = this.promptValue?.options?.max || this.cards.cards.length;

    if (selectedCards.length < min || selectedCards.length > max) {
      this.isInvalid = true;
      return;
    }

    // Validate using server-side validation
    this.isInvalid = !this.promptValue.validate(selectedCards);

    // Update the result array to match selected cards
    this.result = selectedIndices;
    this.onChange(selectedIndices);
  }

  public onChange(result: number[]) {
    if (!result || !this.promptValue) {
      this.isInvalid = true;
      this.result = [];
      return;
    }

    const selectedCards = result.map(index => this.cards.cards[index]);
    const isValidSelection = this.promptValue.validate(selectedCards);

    // Store valid results
    if (isValidSelection) {
      this.result = result;
    }

    this.isInvalid = !isValidSelection;
  }

  get isSetupGame(): boolean {
    return this.promptValue?.message === 'CHOOSE_STARTING_POKEMONS';
  }
}