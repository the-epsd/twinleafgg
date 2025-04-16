import { Component, Host, Input, Optional, ElementRef, Renderer2, OnChanges, SimpleChanges } from '@angular/core';
import { Card, CardList, ChooseCardsPrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PromptComponent } from '../prompt.component';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptItem } from '../prompt-card-item.interface';
import { PromptCardItem } from './prompt-choose-cards.interface';
import { PromptBaseComponent } from '../prompt-base/prompt-base.component';

@Component({
  selector: 'ptcg-prompt-choose-cards',
  templateUrl: './prompt-choose-cards.component.html',
  styleUrls: ['./prompt-choose-cards.component.scss']
})
export class PromptChooseCardsComponent extends PromptBaseComponent implements OnChanges {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.promptValue = prompt;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.allowedCancel = prompt.options.allowCancel;
    this.blocked = prompt.options.blocked;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.isSecret = prompt.options.isSecret;
    this.cardbackMap = {};
    this.selectedCards = [];
    this.result = [];
    this.currentIndex = 0;

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

  public currentTab = 'Valid';
  public tabs = ['Valid', 'All'];
  public filteredCards: Card[] = [];
  private result: number[] = [];

  // Carousel properties
  public promptItems: PromptCardItem[] = [];
  public allPromptItems: PromptCardItem[] = []; // Store all cards
  public visibleCards: PromptCardItem[] = [];
  public currentIndex = 0;
  public selectedCards: PromptCardItem[] = [];
  public filterMap: { [fullName: string]: boolean } = {};

  private lastWheelTime = 0;
  private readonly WHEEL_DELAY = 200; // milliseconds between wheel events

  constructor(
    gameService: GameService,
    private cardsBaseService: CardsBaseService,
    @Host() @Optional() parentPrompt: PromptComponent,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    super(gameService, parentPrompt);
    // Ensure we have access to the parent prompt
    if (!parentPrompt) {
      console.warn('PromptChooseCardsComponent initialized without parent prompt');
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // Handle prompt changes
    if (changes.prompt) {
      const currentPrompt = changes.prompt.currentValue;
      const previousPrompt = changes.prompt.previousValue;

      // Only reinitialize if we have a new prompt or the prompt content has changed
      if (currentPrompt && (!previousPrompt ||
        currentPrompt.id !== previousPrompt.id ||
        currentPrompt.cards !== previousPrompt.cards)) {
        this.initializePrompt();
      }
    }

    // Handle game state changes
    if (changes.gameState) {
      const currentState = changes.gameState.currentValue;
      const previousState = changes.gameState.previousValue;

      // Update validity if game state has changed
      if (currentState && (!previousState ||
        currentState.state !== previousState.state)) {
        this.updateValidity();
      }
    }
  }

  private initializePrompt() {
    if (!this.promptValue) {
      return;
    }

    // Reset state
    this.cards = this.promptValue.cards;
    this.filter = this.promptValue.filter;
    this.allowedCancel = this.promptValue.options.allowCancel;
    this.blocked = this.promptValue.options.blocked;
    this.message = this.promptValue.message;
    this.promptId = this.promptValue.id;
    this.isSecret = this.promptValue.options.isSecret;
    this.cardbackMap = {};
    this.selectedCards = [];
    this.result = [];
    this.currentIndex = 0;

    // Start with invalid state if min > 0
    this.isInvalid = this.promptValue.options.min > 0;

    if (this.promptValue.options.isSecret) {
      this.promptValue.cards.cards.forEach((c, i) => {
        this.cardbackMap[i] = true;
      });
    }

    // Initialize card items
    this.initializeCardItems();
  }

  private initializeCardItems() {
    if (!this.cards || !this.cards.cards) {
      return;
    }

    // Build filter map
    this.filterMap = this.buildFilterMap(this.cards.cards, this.filter, this.blocked || []);

    // Build card list
    this.allPromptItems = this.buildCardList(this.cards.cards);
    this.updateFilteredItems();

    // Initialize visible cards with first card centered
    this.currentIndex = 0;
    this.updateVisibleCards();
  }

  private updateFilteredItems() {
    if (this.currentTab === 'Valid') {
      this.promptItems = this.allPromptItems.filter(item => item.isAvailable);
    } else {
      this.promptItems = [...this.allPromptItems];
    }
    this.updateVisibleCards();
  }

  public onTabChange(tab: string) {
    this.currentTab = tab;
    this.currentIndex = 0; // Reset to first card when switching tabs
    this.updateFilteredItems();
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
        originalIndex: index,
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
    // Clear the current visible cards
    this.visibleCards = [];

    const startIdx = Math.max(0, this.currentIndex);
    const endIdx = Math.min(this.promptItems.length, startIdx + 3);

    // Get the main visible cards
    const mainCards = this.promptItems.slice(startIdx, endIdx);

    // Add left-side cards if available
    if (this.currentIndex > 0) {
      const leftCard = this.promptItems[this.currentIndex - 1];
      if (leftCard) {
        this.visibleCards.push({ ...leftCard, isLeftSide: true, isLeftBack: false });
      }

      // Add left-back card if available
      if (this.currentIndex > 1) {
        const leftBackCard = this.promptItems[this.currentIndex - 2];
        if (leftBackCard) {
          this.visibleCards.unshift({ ...leftBackCard, isLeftSide: true, isLeftBack: true });
        }
      }
    }

    // Add the main cards
    this.visibleCards.push(...mainCards);
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

  public toggleCardSelection(cardItem: PromptCardItem, event?: MouseEvent) {
    if (!this.filterMap[cardItem.card.fullName]) {
      return; // Card is unavailable
    }

    // Skip all animation and directly update the selection state
    this.toggleCardSelectionNoAnimation(cardItem);
  }

  // The data update function
  private toggleCardSelectionNoAnimation(cardItem: PromptCardItem) {
    const selectedIndex = this.selectedCards.findIndex(item => item.card.id === cardItem.card.id);

    if (selectedIndex === -1) {
      // Card is not selected, add it if we haven't reached max
      const maxCards = this.promptValue?.options?.max || 1;
      if (this.selectedCards.length < maxCards) {
        // Add to selected cards
        this.selectedCards.push(cardItem);

        // Remove from promptItems (displayed cards)
        const displayedIndex = this.promptItems.findIndex(item => item.card.id === cardItem.card.id);
        if (displayedIndex !== -1) {
          this.promptItems.splice(displayedIndex, 1);
        }

        // Adjust current index if necessary to prevent display shift
        if (displayedIndex < this.currentIndex) {
          this.currentIndex = Math.max(0, this.currentIndex - 1);
        }
      }
    } else {
      // Card is already selected, remove it
      const selectedCard = this.selectedCards.splice(selectedIndex, 1)[0];

      // Re-insert into promptItems at appropriate position
      let insertIndex = 0;
      for (let i = 0; i < this.promptItems.length; i++) {
        if (this.promptItems[i].originalIndex > selectedCard.originalIndex) {
          break;
        }
        insertIndex = i + 1;
      }

      this.promptItems.splice(insertIndex, 0, selectedCard);

      // Adjust current index if necessary
      if (insertIndex <= this.currentIndex) {
        this.currentIndex = Math.min(this.promptItems.length - 1, this.currentIndex + 1);
      }
    }

    // Update visible cards
    this.updateVisibleCards();

    // Update validity and result
    this.updateValidity();
  }

  public isCardSelected(card: Card): boolean {
    return this.selectedCards.some(sc => sc.card.id === card.id);
  }

  public showCardInfo(item: PromptCardItem) {
    const facedown = this.cardbackMap[item.index];
    this.cardsBaseService.showCardInfo({ card: item.card, facedown });
  }

  public getSlotArray(): number[] {
    if (this.isSetupGame) {
      return Array(6).fill(0).map((_, i) => i);
    }
    const maxCards = this.promptValue?.options?.max || 1;
    return Array(maxCards).fill(0).map((_, i) => i);
  }

  private updateValidity() {
    // Map selected cards to their original indices
    const selectedIndices = this.selectedCards.map(item => item.originalIndex);
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