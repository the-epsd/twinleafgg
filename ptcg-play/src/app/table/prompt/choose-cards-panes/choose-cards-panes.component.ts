import { Component, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { Card, ChooseCardsPrompt, ChooseEnergyPrompt, ChoosePrizePrompt, DiscardEnergyPrompt, EnergyCard } from 'ptcg-server';
import { DraggedItem } from '@ng-dnd/sortable';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { PromptCardType, PromptItem } from '../prompt-card-item.interface';
import { ChooseCardsSortable } from './choose-cards-panes.interface';


@Component({
  selector: 'ptcg-choose-cards-panes',
  templateUrl: './choose-cards-panes.component.html',
  styleUrls: ['./choose-cards-panes.component.scss']
})
export class ChooseCardsPanesComponent implements OnChanges {
  selectedCards: any[] = [];
  currentIndex = 0;
  visibleCards: any[] = [];
  public readonly topListId = 'CHOOSE_CARDS_TOP_LIST';
  public readonly bottomListId = 'CHOOSE_CARDS_BOTTOM_LIST';
  public showButtons = false;

  @Input() cards: Card[];
  @Input() filter: Partial<Card> = {};
  @Input() blocked: number[] = [];
  @Input() cardbackMap: { [index: number]: boolean } = {};
  @Input() topCardbackMap: { [index: number]: boolean } = {};
  @Input() bottomCardbackMap: { [index: number]: boolean } = {};
  @Input() singlePaneMode = false;
  @Output() changeCards = new EventEmitter<number[]>();
  @Input() promptValue: ChooseCardsPrompt;
  @Input() maxCards: number;
  @ViewChild('viewport') viewport: ElementRef;
  @Input() showDetailButtons = true;
  @Input() noBottomPane = false;
  @Input() dragConfig: { dragEnabled: boolean } = { dragEnabled: false };


  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filterMap: { [fullName: string]: boolean } = {};
  public topSortable: ChooseCardsSortable;
  public bottomSortable: ChooseCardsSortable;

  constructor(
    private cardsBaseService: CardsBaseService
  ) {
    this.topSortable = this.buildPromptSortable();
    this.bottomSortable = this.buildPromptSortable();
  }

  get isSetupGame(): boolean {
    return this.promptValue?.message === 'CHOOSE_STARTING_POKEMONS';
  }

  get isAttachEnergyPrompt(): boolean {
    return this.promptValue?.message === 'ATTACH_ENERGY_CARDS';
  }

  toggleCardSelection(card: any) {
    if (this.noBottomPane || !this.filterMap[card.fullName]) {
      return;
    }

    const index = this.selectedCards.indexOf(card);
    if (index === -1 && this.selectedCards.length < this.maxCards) {
      // Adding card to selection
      const originalCard = this.cards[this.cards.indexOf(card)];
      const selectedCard = {
        ...originalCard,
        isSecret: this.promptValue?.options?.isSecret || false,
        cardImage: this.promptValue?.options?.isSecret ? 'assets/cardback.png' : card.cardImage,
        originalIndex: this.cards.indexOf(card)
      };
      this.selectedCards.push(selectedCard);

      // Remove from available cards
      const cardIndex = this.topSortable.tempList.findIndex(item => item.card === card);
      if (cardIndex !== -1) {
        this.topSortable.tempList.splice(cardIndex, 1);
        this.topSortable.list = [...this.topSortable.tempList];
      }
    } else if (index !== -1) {
      // Removing card from selection
      const unselectedCard = this.selectedCards[index];
      const originalCard = this.cards[unselectedCard.originalIndex];

      // Remove from selected cards
      this.selectedCards.splice(index, 1);

      // Create new item for top list
      const newItem = {
        card: originalCard,
        index: unselectedCard.originalIndex,
        isAvailable: true,
        isSecret: !!this.cardbackMap[unselectedCard.originalIndex],
        scanUrl: this.cardsBaseService.getScanUrl(originalCard)
      };

      // Insert at original position and update both lists
      const insertIndex = Math.min(unselectedCard.originalIndex, this.topSortable.list.length);
      this.topSortable.list.splice(insertIndex, 0, newItem);
      this.topSortable.tempList = [...this.topSortable.list];
    }

    const selectedIndices = this.selectedCards.map(selectedCard => selectedCard.originalIndex);
    this.changeCards.emit(selectedIndices);
  }

  private validateSelection() {
    // Validate all selected cards
    this.selectedCards = this.selectedCards.filter(card => {
      const isValid = this.filterMap[card.fullName]
        && this.selectedCards.length <= this.maxCards;
      if (!isValid) {
        // Return card to top pane if invalid
        this.topSortable.tempList = [...this.topSortable.tempList, {
          card,
          index: this.cards.indexOf(card),
          isAvailable: this.filterMap[card.fullName],
          isSecret: !!this.cardbackMap[this.cards.indexOf(card)],
          scanUrl: this.cardsBaseService.getScanUrl(card)
        }];
      }
      return isValid;
    });
  }

  isCardSelected(card: any): boolean {
    return this.selectedCards.includes(card);
  }

  public showCardInfo(context: DraggedItem<PromptItem>) {
    const card = context.data.card;
    const facedown = this.cardbackMap[context.data.index];
    this.cardsBaseService.showCardInfo({ card, facedown });
  }

  private buildPromptSortable(): ChooseCardsSortable {
    const sortable: ChooseCardsSortable = {
      list: [],
      tempList: [],
      spec: undefined
    };

    sortable.spec = {
      type: PromptCardType,
      trackBy: item => item.index,
      hover: item => {
        this.updateTempLists(sortable, item);
      },
      drop: item => {
        this.updateTempLists(sortable, item);
        this.commitTempLists();
      },
      canDrag: () => this.dragConfig.dragEnabled,
      endDrag: () => {
        this.revertTempLists();
      }
    };

    return sortable;
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

  private buildCardList(cards: Card[]): PromptItem[] {
    return cards.map((card, index) => {
      const item: PromptItem = {
        card,
        index,
        isAvailable: this.filterMap[card.fullName],
        isSecret: !!this.cardbackMap[index],
        scanUrl: this.cardsBaseService.getScanUrl(card)
      };
      return item;
    });
  }

  private updateTempLists(sortable: ChooseCardsSortable, item: DraggedItem<PromptItem>) {
    let topList = this.topSortable.tempList;
    let bottomList = this.bottomSortable.tempList;

    const topIndex = topList.findIndex(i => i.index === item.data.index);
    const bottomIndex = bottomList.findIndex(i => i.index === item.data.index);

    if (topIndex !== -1) {
      topList = topList.slice();
      topList.splice(topIndex, 1);
    }

    if (bottomIndex !== -1) {
      bottomList = bottomList.slice();
      bottomList.splice(bottomIndex, 1);
    }

    if (sortable === this.topSortable) {
      topList = topIndex !== -1 ? topList : topList.slice();
      topList.splice(item.hover.index, 0, item.data);
    }

    if (sortable === this.bottomSortable) {
      bottomList = bottomIndex !== -1 ? bottomList : bottomList.slice();
      bottomList.splice(item.hover.index, 0, item.data);
    }

    if (topList !== this.topSortable.tempList) {
      this.topSortable.tempList = topList;
    }

    if (bottomList !== this.bottomSortable.tempList) {
      this.bottomSortable.tempList = bottomList;
    }
  }

  getSlotArray(): number[] {
    const prizePromptOptions = (this.promptValue as any)?.options;
    if (prizePromptOptions?.count) {
      return Array(prizePromptOptions.count).fill(0).map((_, i) => i);
    }

    if (this.promptValue instanceof ChooseEnergyPrompt && this.promptValue.cost) {
      return Array(this.promptValue.cost.length).fill(0).map((_, i) => i);
    }

    return Array(this.maxCards).fill(0).map((_, i) => i);
  }

  private commitTempLists() {
    this.topSortable.list = this.topSortable.tempList.slice();
    this.bottomSortable.list = this.bottomSortable.tempList.slice();

    const result = this.singlePaneMode
      ? this.topSortable.list.map(i => i.index)
      : this.bottomSortable.list.map(i => i.index);

    this.changeCards.next(result);
  }

  private revertTempLists() {
    this.topSortable.tempList = this.topSortable.list.slice();
    this.bottomSortable.tempList = this.bottomSortable.list.slice();
  }

  ngOnInit() {
    const cost = (this.promptValue as unknown as ChooseEnergyPrompt)?.cost?.length;
    this.maxCards = cost || this.promptValue?.options?.max || 1;
  }

  ngOnChanges() {
    if (this.cards && this.filter && this.blocked) {
      this.filterMap = this.buildFilterMap(this.cards, this.filter, this.blocked);
      this.topSortable.tempList = this.buildCardList(this.cards);
      this.bottomSortable.tempList = [];

      // Set maxCards based on prompt type
      const cost = (this.promptValue as unknown as ChooseEnergyPrompt)?.cost?.length;
      const prizeCount = (this.promptValue as unknown as ChoosePrizePrompt)?.options?.count;
      const totalEnergy = this.cards.filter(card => card instanceof EnergyCard).length;

      this.maxCards = prizeCount || cost || totalEnergy || this.promptValue?.options?.max || 1;

      this.commitTempLists();
    }
  }
}
