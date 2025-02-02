import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef } from '@angular/core';
import { DndService, DropTarget } from '@ng-dnd/core';
import { DraggedItem, SortableSpec } from '@ng-dnd/sortable';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { map } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckEditPane } from './deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckItem, LibraryItem } from '../deck-card/deck-card.interface';
import { DeckCardType } from '../deck-card/deck-card.component';
import { DeckEditVirtualScrollStrategy } from './deck-edit-virtual-scroll-strategy';
import { Card, CardTag, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType } from 'ptcg-server';
import html2canvas from 'html2canvas';

const DECK_CARD_ITEM_WIDTH = 148;
const DECK_CARD_ITEM_HEIGHT = 173;

@Component({
  selector: 'ptcg-deck-edit-panes',
  templateUrl: './deck-edit-panes.component.html',
  styleUrls: ['./deck-edit-panes.component.scss'],
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useValue: new DeckEditVirtualScrollStrategy(DECK_CARD_ITEM_WIDTH, DECK_CARD_ITEM_HEIGHT)
  }]
})
export class DeckEditPanesComponent implements OnInit, OnDestroy {

  @Input() toolbarFilter: DeckEditToolbarFilter;
  @Output() deckItemsChange = new EventEmitter<DeckItem[]>();


  @Input() set deckItems(value: DeckItem[]) {
    this.list = value;
    this.tempList = this.sortByPokemonEvolution([...value]);
  }

  public deckTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public deckHighlight$: Observable<boolean>;
  public libraryTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public libraryHighlight$: Observable<boolean>;
  public deckSpec: SortableSpec<DeckItem>;
  public cards: LibraryItem[] = [];
  public hasDropped: boolean;

  list: DeckItem[] = [];
  tempList: DeckItem[] = [];

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private ngZone: NgZone,
    private dnd: DndService,
    private translate: TranslateService
  ) {
    [this.deckTarget, this.deckHighlight$] = this.initDropTarget(DeckEditPane.DECK);
    [this.libraryTarget, this.libraryHighlight$] = this.initDropTarget(DeckEditPane.LIBRARY);

    this.deckSpec = {
      type: DeckCardType,
      trackBy: item => item.card.fullName + item.pane,
      canDrag: () => false,
      hover: item => {
        this.tempList = this.moveDeckCards(item);
      },
      drop: item => {
        this.hasDropped = true;
        this.tempList = this.list = this.moveDeckCards(item);
        if (!item.isInternal) {
          const newItem = this.list.find(i => i.card.fullName === item.data.card.fullName);
          newItem.count += 1;
        }
        this.deckItemsChange.next(this.list);
      },
      endDrag: () => {
        this.hasDropped = false;
        this.tempList = this.list.sort((a, b) => {
          const result = this.compareSupertype(a.card.superType) - this.compareSupertype(b.card.superType);

          // not of the same supertype
          if (result !== 0) {
            return result;
          }

          // cards match supertype, so sort by subtype
          if ((<any>a.card).trainerType != null) {
            const cardA = a.card as TrainerCard;
            if (cardA.trainerType != null && (<any>b.card).trainerType != null) {
              const cardB = b.card as TrainerCard;
              const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
              if (subtypeCompare !== 0) {
                return subtypeCompare;
              }
            }
          }
          else if ((<any>a.card).energyType != null) {
            const cardA = a.card as EnergyCard;
            if (cardA.energyType != null && (<any>b.card).energyType != null) {
              const cardB = b.card as TrainerCard;
              const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType);
              if (subtypeCompare !== 0) {
                return subtypeCompare;
              }
            }
          }

          // subtype matches, sort by name
          if (a.card.name < b.card.name) {
            return -1;
          } else {
            return 1;
          }
        });
        this.tempList = this.sortByPokemonEvolution([...this.tempList]);
      },
      isDragging: (ground: DeckItem, inFlight: DraggedItem<DeckItem>) => {
        return ground.card.fullName === inFlight.data.card.fullName;
      }
    };
  }

  sortByPokemonEvolution(cards: DeckItem[]): DeckItem[] {
    const firstTrainerIndex = cards.findIndex((d) => d.card.superType === SuperType.TRAINER);

    for (let i = 0; i < firstTrainerIndex; i++) {
      if ((<PokemonCard>cards[i].card).evolvesFrom) {
        const indexOfPrevolution = this.findLastIndex(cards, c => c.card.name === (<PokemonCard>cards[i].card).evolvesFrom);

        if (cards[indexOfPrevolution]?.card.superType !== SuperType.POKEMON) {
          continue;
        }

        const currentPokemon = { ...cards.splice(i, 1)[0] };

        cards = [
          ...cards.slice(0, indexOfPrevolution + 1),
          { ...currentPokemon },
          ...cards.slice(indexOfPrevolution + 1),
        ];
      }
    }

    return cards;
  }

  // sortByPokemonEvolution(cards: DeckItem[]): DeckItem[] {
  //   // Sort by superType first
  //   cards.sort((a, b) => a.card.superType - b.card.superType);
  //   const firstTrainerIndex = cards.findIndex((d) => d.card.superType === SuperType.TRAINER);

  //   for (let i = 0; i < firstTrainerIndex; i++) {
  //     if ((<PokemonCard>cards[i].card).evolvesFrom) {
  //       const indexOfPrevolution = this.findLastIndex(cards, c => c.card.name === (<PokemonCard>cards[i].card).evolvesFrom);

  //       if (cards[indexOfPrevolution]?.card.superType !== SuperType.POKEMON) {
  //         continue;
  //       }

  //       const currentPokemon = { ...cards.splice(i, 1)[0] };

  //       cards = [
  //         ...cards.slice(0, indexOfPrevolution + 1),
  //         { ...currentPokemon },
  //         ...cards.slice(indexOfPrevolution + 1),
  //       ];
  //     }
  //   }

  //   // Sort Pokemon cards by cardType after sorting by evolution
  //   const pokemonCards = cards.slice(0, firstTrainerIndex);
  //   pokemonCards.sort((a, b) => {
  //     const cardA = a.card as PokemonCard;
  //     const cardB = b.card as PokemonCard;
  //     return cardA.cardType - cardB.cardType;
  //   });
  //   cards = [...pokemonCards, ...cards.slice(firstTrainerIndex)];

  //   // Sort Trainer cards by trainerType and then alphabetically
  //   const firstEnergyIndex = cards.findIndex((d) => d.card.superType === SuperType.ENERGY, firstTrainerIndex);
  //   cards = [...cards.slice(0, firstTrainerIndex), ...cards.slice(firstTrainerIndex, firstEnergyIndex).sort((a, b) => {
  //     const trainerA = a.card as TrainerCard;
  //     const trainerB = b.card as TrainerCard;

  //     const trainerTypeOrder = [TrainerType.SUPPORTER, TrainerType.ITEM, TrainerType.TOOL, TrainerType.STADIUM];
  //     const trainerAIndex = trainerTypeOrder.indexOf(trainerA.trainerType);
  //     const trainerBIndex = trainerTypeOrder.indexOf(trainerB.trainerType);

  //     if (trainerAIndex !== trainerBIndex) {
  //       return trainerAIndex - trainerBIndex;
  //     }

  //     return trainerA.name.localeCompare(trainerB.name);
  //   }), ...cards.slice(firstEnergyIndex)];

  //   // Sort Energy cards
  //   const energyCards = cards.slice(firstEnergyIndex);
  //   const specialEnergyCards = energyCards.filter((d) => d.card.energyType === EnergyType.SPECIAL);
  //   const basicEnergyCards = energyCards.filter((d) => d.card.energyType === EnergyType.BASIC);

  //   specialEnergyCards.sort((a, b) => a.card.name.localeCompare(b.card.name));
  //   basicEnergyCards.sort((a, b) => a.card.name.localeCompare(b.card.name));

  //   cards = [...cards.slice(0, firstEnergyIndex), ...specialEnergyCards, ...basicEnergyCards];

  //   return cards;
  // }

  findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    let l = array.length;
    while (l--) {
      if (predicate(array[l], l, array))
        return l;
    }
    return -1;
  }

  compareSupertype = (input: SuperType) => {
    if (input === SuperType.POKEMON) return 1;
    if (input === SuperType.TRAINER) return 2;
    if (input === SuperType.ENERGY) return 3;
    return Infinity;
  };

  compareTrainerType = (input: TrainerType) => {
    if (input === TrainerType.SUPPORTER) return 1;
    if (input === TrainerType.ITEM) return 2;
    if (input === TrainerType.TOOL) return 3;
    if (input === TrainerType.STADIUM) return 4;
    return Infinity;
  };

  compareEnergyType = (input: EnergyType) => {
    if (input === EnergyType.BASIC) return 1;
    if (input === EnergyType.SPECIAL) return 2;
    return Infinity;
  };

  private loadLibraryCards(): LibraryItem[] {
    return this.cardsBaseService.getCards().map((card, index) => {
      let item: LibraryItem;

      const spec: SortableSpec<DeckItem, any> = {
        ...this.deckSpec,
        createData: () => item
      };

      item = {
        card,
        pane: DeckEditPane.LIBRARY,
        count: 1,
        scanUrl: this.cardsBaseService.getScanUrl(card),
        spec
      };
      return item;
    });
  }

  private moveDeckCards(item: DraggedItem<DeckItem>) {
    const temp = this.list.slice();
    const index = this.list.findIndex(i => i.card.fullName === item.data.card.fullName);
    let data: DeckItem = item.data;

    if (item.isInternal) {
      temp.splice(item.index, 1);

    } else {
      data = { ...item.data, pane: DeckEditPane.DECK, count: 0 };
      if (index !== -1) {
        data.count = this.list[index].count;
        temp.splice(index, 1);
      }
    }

    // Find place to put the transit object
    let target = item.hover.index;
    if (target === -1) {
      target = index;
    }
    if (target === -1) {
      target = temp.length;
    }

    temp.splice(target, 0, data);
    return temp;
  }

  private initDropTarget(pane: DeckEditPane): [DropTarget<DraggedItem<DeckItem>, any>, Observable<boolean>] {
    let dropTarget: DropTarget<DraggedItem<DeckItem>, any>;
    let highlight$: Observable<boolean>;

    dropTarget = this.dnd.dropTarget(DeckCardType, {
      canDrop: monitor => {
        const card = monitor.getItem().data;
        return card.pane !== pane;
      },
      drop: monitor => {
        // Card already dropped on the list
        if (this.hasDropped) {
          return;
        }
        const card = monitor.getItem().data;
        this.ngZone.run(() => pane === DeckEditPane.LIBRARY
          ? this.removeCardFromDeck(card)
          : this.addCardToDeck(card));
      }
    });

    const dropState = dropTarget.listen(monitor => ({
      canDrop: monitor.canDrop(),
      isOver: monitor.isOver(),
    }));

    highlight$ = dropState.pipe(map(state => state.canDrop && state.isOver));

    return [dropTarget, highlight$];
  }

  trackByCard(index: number, card: any): string {
    return card.id; // or any unique identifier for the card
  }

  public async addCardToDeck(item: DeckItem) {
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);
    let list = this.tempList.slice();

    // Check for ACE_SPEC
    if (item.card.tags.includes(CardTag.ACE_SPEC)) {
      const aceSpecCount = list.filter(c => c.card.tags.includes(CardTag.ACE_SPEC)).reduce((sum, c) => sum + c.count, 0);
      if (aceSpecCount >= 1) {
        // Alert user that only one ACE_SPEC card is allowed
        return;
      }
    }

    // Check for RADIANT
    if (item.card.tags.includes(CardTag.RADIANT)) {
      const radiantCount = list.filter(c => c.card.tags.includes(CardTag.RADIANT)).reduce((sum, c) => sum + c.count, 0);
      if (radiantCount >= 1) {
        // Alert user that only one RADIANT card is allowed
        return;
      }
    }

    // Check for PRISM_STAR
    if (item.card.tags.includes(CardTag.PRISM_STAR)) {
      const prismStarCount = list.filter(c => c.card.fullName === item.card.fullName).reduce((sum, c) => sum + c.count, 0);
      if (prismStarCount >= 1) {
        // Alert user that only one of each PRISM_STAR card is allowed
        return;
      }
    }

    const count = 1;
    if (index === -1) {
      list.push({ ...item, pane: DeckEditPane.DECK, count });
    } else {
      if (list[index].count < 4) {
        list[index].count += count;
      }
      else {
        if (list[index].count < 99 && list[index].card.energyType === EnergyType.BASIC) {
          list[index].count += count;
        }
      }
    }

    list.sort((a, b) => {
      const result = this.compareSupertype(a.card.superType) - this.compareSupertype(b.card.superType);

      // not of the same supertype
      if (result !== 0) {
        return result;
      }

      // cards match supertype, so sort by subtype
      if ((<any>a.card).trainerType != null) {
        const cardA = a.card as TrainerCard;
        if (cardA.trainerType != null && (<any>b.card).trainerType != null) {
          const cardB = b.card as TrainerCard;
          const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }
      else if ((<any>a.card).energyType != null) {
        const cardA = a.card as EnergyCard;
        if (cardA.energyType != null && (<any>b.card).energyType != null) {
          const cardB = b.card as TrainerCard;
          const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }

      // subtype matches, sort by name
      if (a.card.name < b.card.name) {
        return -1;
      } else {
        return 1;
      }
    });

    list = this.sortByPokemonEvolution(list);

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  public async removeCardFromDeck(item: DeckItem) {
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);
    if (index === -1) {
      return;
    }

    const count = 1;
    let list = this.tempList.slice();
    if (list[index].count <= count) {
      list.splice(index, 1);
    } else {
      list[index].count -= count;
    }

    list.sort((a, b) => {
      const result = this.compareSupertype(a.card.superType) - this.compareSupertype(b.card.superType);

      // not of the same supertype
      if (result !== 0) {
        return result;
      }

      // cards match supertype, so sort by subtype
      if ((<any>a.card).trainerType != null) {
        const cardA = a.card as TrainerCard;
        if (cardA.trainerType != null && (<any>b.card).trainerType != null) {
          const cardB = b.card as TrainerCard;
          const subtypeCompare = this.compareTrainerType(cardA.trainerType) - this.compareTrainerType(cardB.trainerType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }
      else if ((<any>a.card).energyType != null) {
        const cardA = a.card as EnergyCard;
        if (cardA.energyType != null && (<any>b.card).energyType != null) {
          const cardB = b.card as TrainerCard;
          const subtypeCompare = this.compareEnergyType(cardA.energyType) - this.compareEnergyType(cardB.energyType);
          if (subtypeCompare !== 0) {
            return subtypeCompare;
          }
        }
      }

      // subtype matches, sort by name
      if (a.card.name < b.card.name) {
        return -1;
      } else {
        return 1;
      }
    });

    list = this.sortByPokemonEvolution(list);

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  @ViewChild('deckPane') deckPane: ElementRef;

  public exportDeckImage() {
    const element = this.deckPane.nativeElement;
    const clone = element.cloneNode(true) as HTMLElement;
    document.body.appendChild(clone);

    const deckCardElements = clone.querySelectorAll('.ptcg-deck-card');
    deckCardElements.forEach((card: HTMLElement) => {
      card.style.transform = 'scale(1.25)'; // Adjust the scale factor as needed
      card.style.transformOrigin = 'center';
      card.style.margin = '23px 15px'; // Add some margin to prevent overlap
    });

    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.width = '1920px';
    clone.style.height = '1080px';
    clone.style.overflow = 'hidden';
    clone.style.paddingLeft = '63px';
    clone.style.boxSizing = 'border-box';
    clone.style.flexWrap = 'wrap';
    clone.style.alignContent = 'flex-start';
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';
    clone.style.justifyContent = 'center';
    clone.style.alignItems = 'center';
    clone.style.backgroundImage = 'url("assets/deck-builder-bg.png")';
    clone.style.backgroundSize = 'cover';
    clone.style.backgroundPosition = 'center';

    // const cardElements = clone.querySelectorAll('.card-element');
    // cardElements.forEach((card: HTMLElement) => {
    //   card.style.transform = 'scale(3)';
    //   card.style.margin = '10px';
    // });

    // const cardTextElements = clone.querySelectorAll('.card-text');
    // cardTextElements.forEach((text: HTMLElement) => {
    //   text.style.display = 'none';
    // });

    html2canvas(clone, {
      width: 1920,
      height: 1080,
      // scale: 4,
      allowTaint: true,
      useCORS: true,
      scrollX: 0,
      scrollY: 0
    }).then(canvas => {
      document.body.removeChild(clone);

      const link = document.createElement('a');
      link.download = 'deck_image.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  }



  public async setCardCount(item: DeckItem) {
    const MAX_CARD_VALUE = 99;
    const index = this.tempList.findIndex(c => c.card.fullName === item.card.fullName);
    if (index !== -1) {
      item = this.tempList[index];
    }

    const count = await this.alertService.inputNumber({
      title: this.translate.instant('DECK_EDIT_HOW_MANY_CARDS'),
      value: item.count,
      minValue: 0,
      maxValue: MAX_CARD_VALUE
    });
    if (count === undefined) {
      return;
    }

    const list = this.tempList.slice();
    if (index === -1 && count === 0) {
      return;
    } else if (index === -1) {
      list.push({ ...item, pane: DeckEditPane.DECK, count });
    } else {
      if (count > 0) {
        list[index].count = count;
      } else {
        list.splice(index, 1);
      }
    }

    this.tempList = this.list = list;
    this.deckItemsChange.next(list);
  }

  public showCardInfo(item: LibraryItem) {
    this.cardsBaseService.showCardInfo({ card: item.card });
  }

  ngOnInit() {
    this.cards = this.loadLibraryCards();
  }

  ngOnDestroy() {
    this.deckTarget.unsubscribe();
  }

  // deck-edit-panes.component.ts

  onDeckCardClick(card: DeckItem) {
    this.removeCardFromDeck(card);
  }

  onLibraryCardClick(card: DeckItem) {
    this.addCardToDeck(card);
  }

  onCardSelectedOnDialog(currentCard: DeckItem, selectedCard: Card, action: 'add' | 'replace') {
    const countToReplace = +currentCard.count;
    if (action === 'replace') {
      for (let i = 0; i < countToReplace; i++) {
        this.removeCardFromDeck(currentCard);
        this.addCardToDeck({
          ...currentCard,
          card: selectedCard
        });
      }
    } else {
      this.addCardToDeck({
        count: 1,
        card: selectedCard,
        pane: DeckEditPane.DECK,
        scanUrl: this.cardsBaseService.getScanUrl(selectedCard)
      })
    }
  }
}