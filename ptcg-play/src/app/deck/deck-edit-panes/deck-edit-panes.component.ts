import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, NgZone, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, HostListener, ChangeDetectorRef } from '@angular/core';
import { DndService, DropTarget } from '@ng-dnd/core';
import { DraggedItem, SortableSpec } from '@ng-dnd/sortable';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { map, debounceTime } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { DeckEditPane } from './deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckItem, LibraryItem } from '../deck-card/deck-card.interface';
import { DeckCardType } from '../deck-card/deck-card.component';
import { DeckEditVirtualScrollStrategy } from './deck-edit-virtual-scroll-strategy';
import { Card, CardTag, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType, CardType, Stage } from 'ptcg-server';
import html2canvas from 'html2canvas';
import { DeckService } from 'src/app/api/services/deck.service';

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
export class DeckEditPanesComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  @Input() toolbarFilter: DeckEditToolbarFilter;
  @Output() deckItemsChange = new EventEmitter<DeckItem[]>();
  public showLibrary = true;

  @Input() set deckItems(value: DeckItem[]) {
    this.list = value;
    this.tempList = this.sortByPokemonEvolution([...value]);
    this.updateDeckFormats();
    this.scheduleArrowUpdate();
  }

  @Input() disabled: boolean = false;
  @Input() isThemeDeck: boolean = false;
  @Input() unlockedArtworks: { id: number; name: string; cardName: string; setCode: string; code: string; imageUrl: string; holoType: string }[] = [];
  @Input() selectedArtworks: { code: string; artworkId?: number }[] = [];
  @Output() artworkChange = new EventEmitter<{ code: string; artworkId?: number | null }>();

  public deckTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public deckHighlight$: Observable<boolean>;
  public libraryTarget: DropTarget<DraggedItem<DeckItem>, any>;
  public libraryHighlight$: Observable<boolean>;
  public deckSpec: SortableSpec<DeckItem>;
  public cards: LibraryItem[] = [];
  public hasDropped: boolean;

  list: DeckItem[] = [];
  tempList: DeckItem[] = [];
  public deckFormats: number[] = [];
  public deckIsValid: boolean = false;

  @ViewChild('evolutionArrows') evolutionArrows: ElementRef<SVGElement>;
  private updateArrowsSubject = new Subject<void>();
  private arrowsUpdateSubscription: any;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private ngZone: NgZone,
    private dnd: DndService,
    private translate: TranslateService,
    private deckService: DeckService,
    private cdr: ChangeDetectorRef
  ) {
    [this.deckTarget, this.deckHighlight$] = this.initDropTarget(DeckEditPane.DECK);
    [this.libraryTarget, this.libraryHighlight$] = this.initDropTarget(DeckEditPane.LIBRARY);

    this.deckSpec = {
      type: DeckCardType,
      trackBy: item => item.card.fullName + item.pane,
      canDrag: () => false,
      hover: item => {
        this.tempList = this.moveDeckCards(item);
        this.scheduleArrowUpdate();
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
        this.tempList = this.sortByPokemonEvolution([...this.list]);
        this.scheduleArrowUpdate();
      },
      isDragging: (ground: DeckItem, inFlight: DraggedItem<DeckItem>) => {
        return ground.card.fullName === inFlight.data.card.fullName;
      }
    };
  }

  public getSelectedArtworkId(cardFullName: string): number | null {
    const entry = this.selectedArtworks.find(a => a.code === cardFullName);
    return entry && entry.artworkId != null ? entry.artworkId : null;
  }

  public getSelectedArtworkIdString(cardFullName: string): string {
    const id = this.getSelectedArtworkId(cardFullName);
    return id != null ? String(id) : '';
  }

  public onArtworkSelect(cardFullName: string, value: any) {
    const valueStr = String(value);
    const artworkId = valueStr === '' ? null : Number(valueStr);
    this.artworkChange.emit({ code: cardFullName, artworkId });
  }

  public resolveArtworkUrlFor(card: Card): string | undefined {
    if (!card) return undefined;
    const entry = this.selectedArtworks?.find(a => a.code === card.fullName && a.artworkId);
    if (!entry || !entry.artworkId) return undefined;
    const art = this.unlockedArtworks?.find(a => a.id === entry.artworkId);
    return art?.imageUrl || undefined;
  }

  sortByPokemonEvolution(cards: DeckItem[]): DeckItem[] {
    // Separate cards by supertype
    const pokemonCards = cards.filter(d => d.card.superType === SuperType.POKEMON);
    const trainerCards = cards.filter(d => d.card.superType === SuperType.TRAINER);
    const energyCards = cards.filter(d => d.card.superType === SuperType.ENERGY);

    // Build evolution chains
    const evolutionChains = new Map<string, DeckItem[]>();
    const processedCards = new Set<string>();
    const cardNameMap = new Map<string, DeckItem[]>();

    // Create a map of cards by name for quick lookup
    pokemonCards.forEach(item => {
      const pokemonCard = item.card as PokemonCard;
      const name = pokemonCard.name;
      if (!cardNameMap.has(name)) {
        cardNameMap.set(name, []);
      }
      cardNameMap.get(name)!.push(item);
    });

    // Find the basic Pokemon for each evolution chain
    const findBasicPokemon = (pokemonCard: PokemonCard, visited: Set<string> = new Set()): string | null => {
      const cardName = pokemonCard.name;
      if (visited.has(cardName)) {
        return null; // Circular reference
      }
      visited.add(cardName);

      // If it's a basic Pokemon, return its name
      if (pokemonCard.stage === Stage.BASIC && !pokemonCard.evolvesFrom) {
        return cardName;
      }

      // If it evolves from another Pokemon, find that Pokemon's basic
      if (pokemonCard.evolvesFrom) {
        const preEvolutionCards = cardNameMap.get(pokemonCard.evolvesFrom);
        if (preEvolutionCards && preEvolutionCards.length > 0) {
          const preEvoCard = preEvolutionCards[0].card as PokemonCard;
          const basic = findBasicPokemon(preEvoCard, visited);
          if (basic) {
            return basic;
          }
        }
      }

      // Check if any Pokemon in the deck evolves from this one (reverse relationship)
      for (const [name, items] of cardNameMap.entries()) {
        if (name === cardName) continue;
        const otherCard = items[0].card as PokemonCard;
        if (otherCard.evolvesFrom === cardName) {
          // This is a basic Pokemon that others evolve from
          if (pokemonCard.stage === Stage.BASIC) {
            return cardName;
          }
        }
      }

      // If no basic found and this is a basic, return it
      if (pokemonCard.stage === Stage.BASIC) {
        return cardName;
      }

      return null;
    };

    // Group cards into evolution chains
    const addToChain = (item: DeckItem, chainKey: string) => {
      const fullName = item.card.fullName;
      if (processedCards.has(fullName)) {
        return;
      }

      if (!evolutionChains.has(chainKey)) {
        evolutionChains.set(chainKey, []);
      }

      // Add this card to the chain
      evolutionChains.get(chainKey)!.push(item);
      processedCards.add(fullName);

      const pokemonCard = item.card as PokemonCard;

      // Add all cards with the same name to the chain
      const sameNameCards = cardNameMap.get(pokemonCard.name) || [];
      sameNameCards.forEach(card => {
        if (!processedCards.has(card.card.fullName)) {
          evolutionChains.get(chainKey)!.push(card);
          processedCards.add(card.card.fullName);
        }
      });

      // Recursively add cards that evolve from this one
      pokemonCards.forEach(otherItem => {
        const otherPokemon = otherItem.card as PokemonCard;
        if (otherPokemon.evolvesFrom === pokemonCard.name && !processedCards.has(otherItem.card.fullName)) {
          addToChain(otherItem, chainKey);
        }
      });

      // Recursively add cards that this one evolves from
      if (pokemonCard.evolvesFrom) {
        const preEvolutionCards = cardNameMap.get(pokemonCard.evolvesFrom);
        if (preEvolutionCards) {
          preEvolutionCards.forEach(preEvo => {
            if (!processedCards.has(preEvo.card.fullName)) {
              addToChain(preEvo, chainKey);
            }
          });
        }
      }

      // Handle evolvesTo relationships
      if (pokemonCard.evolvesTo && pokemonCard.evolvesTo.length > 0) {
        pokemonCard.evolvesTo.forEach(evolutionName => {
          const evolutionCards = cardNameMap.get(evolutionName);
          if (evolutionCards) {
            evolutionCards.forEach(evo => {
              if (!processedCards.has(evo.card.fullName)) {
                addToChain(evo, chainKey);
              }
            });
          }
        });
      }
    };

    pokemonCards.forEach(item => {
      const fullName = item.card.fullName;
      if (processedCards.has(fullName)) {
        return;
      }

      const pokemonCard = item.card as PokemonCard;
      const basicName = findBasicPokemon(pokemonCard);

      // Use the basic Pokemon name as the chain key, or the card's name if no basic found
      const chainKey = basicName || pokemonCard.name;

      addToChain(item, chainKey);
    });

    // Stage order for sorting
    const stageOrder = [
      Stage.BASIC,
      Stage.STAGE_1,
      Stage.STAGE_2,
      Stage.VMAX,
      Stage.VSTAR,
      Stage.VUNION,
      Stage.LEGEND,
      Stage.MEGA,
      Stage.BREAK,
      Stage.RESTORED,
      Stage.NONE
    ];

    // Sort each evolution chain by stage, then by name
    evolutionChains.forEach(chain => {
      chain.sort((a, b) => {
        const pokemonA = a.card as PokemonCard;
        const pokemonB = b.card as PokemonCard;
        const aStageIndex = stageOrder.indexOf(pokemonA.stage);
        const bStageIndex = stageOrder.indexOf(pokemonB.stage);

        // If stage is not in the order list, put it at the end
        const aIndex = aStageIndex === -1 ? Infinity : aStageIndex;
        const bIndex = bStageIndex === -1 ? Infinity : bStageIndex;

        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }

        // If same stage, sort by name
        return pokemonA.name.localeCompare(pokemonB.name);
      });
    });

    // Get all cards that are part of evolution chains
    const evolutionChainCards = Array.from(evolutionChains.values()).flat();
    const evolutionCardNames = new Set(evolutionChainCards.map(item => item.card.name));

    // Get non-evolution Pokemon cards
    const nonEvolutionPokemon = pokemonCards.filter(item => !evolutionCardNames.has(item.card.name));

    // Sort non-evolution Pokemon by type and name
    const sortedNonEvolutionPokemon = nonEvolutionPokemon.sort((a, b) => {
      const pokemonA = a.card as PokemonCard;
      const pokemonB = b.card as PokemonCard;

      // First sort by card type
      const typeCompare = this.compareCardType(pokemonA.cardType) - this.compareCardType(pokemonB.cardType);
      if (typeCompare !== 0) return typeCompare;

      // Then sort by name
      return pokemonA.name.localeCompare(pokemonB.name);
    });

    // Sort chains alphabetically by their basic Pokemon name
    const sortedChains = Array.from(evolutionChains.entries())
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([_, chain]) => chain)
      .flat();

    // Sort trainer cards
    const sortedTrainerCards = trainerCards.sort((a, b) => {
      const trainerA = a.card as TrainerCard;
      const trainerB = b.card as TrainerCard;
      const typeCompare = this.compareTrainerType(trainerA.trainerType) - this.compareTrainerType(trainerB.trainerType);
      if (typeCompare !== 0) return typeCompare;
      return trainerA.name.localeCompare(trainerB.name);
    });

    // Sort energy cards
    const sortedEnergyCards = energyCards.sort((a, b) => {
      const energyA = a.card as EnergyCard;
      const energyB = b.card as EnergyCard;
      const typeCompare = this.compareEnergyType(energyA.energyType) - this.compareEnergyType(energyB.energyType);
      if (typeCompare !== 0) return typeCompare;
      return energyA.name.localeCompare(energyB.name);
    });

    // Combine everything in the correct order: evolution chains, non-evolution Pokemon, Trainer, Energy
    return [...sortedChains, ...sortedNonEvolutionPokemon, ...sortedTrainerCards, ...sortedEnergyCards];
  }

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
    const allItems = this.cardsBaseService.getCards().map((card, index) => {
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

    // Group by card name
    const grouped = new Map<string, LibraryItem[]>();
    allItems.forEach(item => {
      const name = item.card.name;
      if (!grouped.has(name)) {
        grouped.set(name, []);
      }
      grouped.get(name)!.push(item);
    });

    // Sort within each group: favorites first
    grouped.forEach((items, name) => {
      items.sort((a, b) => {
        const aIsFavorite = this.cardsBaseService.isFavoriteCard(a.card);
        const bIsFavorite = this.cardsBaseService.isFavoriteCard(b.card);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
        return 0; // Keep original order if both same favorite status
      });
    });

    // Flatten back to array
    return Array.from(grouped.values()).flat();
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
    return this.sortByPokemonEvolution(temp);
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
    if (this.disabled) return;

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
      // First sort the list to find the correct position
      list = this.sortByPokemonEvolution(list);

      // Find the correct position to insert the new card
      let insertIndex = list.length;
      for (let i = 0; i < list.length; i++) {
        const result = this.compareSupertype(item.card.superType) - this.compareSupertype(list[i].card.superType);
        if (result < 0) {
          insertIndex = i;
          break;
        }

        // If same supertype, check card type for Pokemon
        if (result === 0 && item.card.superType === SuperType.POKEMON) {
          const itemCard = item.card as PokemonCard;
          const listCard = list[i].card as PokemonCard;
          const typeCompare = this.compareCardType(itemCard.cardType) - this.compareCardType(listCard.cardType);
          if (typeCompare < 0) {
            insertIndex = i;
            break;
          }
        }
      }

      list.splice(insertIndex, 0, { ...item, pane: DeckEditPane.DECK, count });
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

    this.tempList = this.list = this.sortByPokemonEvolution(list);
    this.deckItemsChange.next(this.list);
    this.updateDeckFormats();
    this.scheduleArrowUpdate();
  }

  public async removeCardFromDeck(item: DeckItem) {
    if (this.disabled) return;

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

    this.tempList = this.list = this.sortByPokemonEvolution(list);
    this.deckItemsChange.next(this.list);
    this.updateDeckFormats();
    this.scheduleArrowUpdate();
  }


  private compareCardType = (cardType: CardType) => {
    const order = [
      CardType.GRASS,
      CardType.FIRE,
      CardType.WATER,
      CardType.LIGHTNING,
      CardType.PSYCHIC,
      CardType.FIGHTING,
      CardType.DARK,
      CardType.METAL,
      CardType.COLORLESS,
      CardType.FAIRY,
      CardType.DRAGON
    ];
    return order.indexOf(cardType);
  };

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
    if (this.disabled) return;

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
    this.updateDeckFormats();
    this.scheduleArrowUpdate();
  }

  public showCardInfo(item: LibraryItem) {
    this.cardsBaseService.showCardInfo({ card: item.card });
  }

  ngOnInit() {
    // Only set showLibrary to false if it's still at its default (true) and this is a theme deck
    if (this.isThemeDeck && this.showLibrary === true) {
      this.showLibrary = false;
    }
    this.cards = this.loadLibraryCards();

    // Setup debounced arrow updates
    this.arrowsUpdateSubscription = this.updateArrowsSubject.pipe(
      debounceTime(50)
    ).subscribe(() => {
      this.updateArrows();
    });
  }

  ngAfterViewInit() {
    // Initial arrow update after view is initialized
    setTimeout(() => this.updateArrows(), 100);
  }

  ngAfterViewChecked() {
    // Only update if we're not already scheduled and view has changed
    // This is debounced so it won't cause performance issues
    // We skip if dragging to avoid updates during drag operations
    if (!this.hasDropped) {
      this.scheduleArrowUpdate();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.scheduleArrowUpdate();
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    if ((event.target as HTMLElement).closest('.ptcg-deck-edit-pane-secondary')) {
      this.scheduleArrowUpdate();
    }
  }

  ngOnDestroy() {
    this.deckTarget.unsubscribe();
    if (this.arrowsUpdateSubscription) {
      this.arrowsUpdateSubscription.unsubscribe();
    }
  }



  onLibraryCardClick(card: DeckItem) {
    this.addCardToDeck(card);
  }

  public refreshLibrary(): void {
    this.cards = this.loadLibraryCards();
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

  public toggleLibrary() {
    this.showLibrary = !this.showLibrary;
  }

  private updateDeckFormats() {
    // Get card names from tempList
    const cardNames = this.tempList.flatMap(item => Array(item.count).fill(item.card.name));
    if (cardNames.length === 0) {
      this.deckFormats = [];
      this.deckIsValid = false;
      return;
    }
    this.deckService.getValidFormatsForCardList(cardNames).subscribe(
      (response: any) => {
        // response is { ok: true, formats: number[] }
        this.deckFormats = response.formats || [];
        this.deckIsValid = this.deckFormats.length > 0;
      },
      () => {
        this.deckFormats = [];
        this.deckIsValid = false;
      }
    );
  }

  private scheduleArrowUpdate() {
    this.updateArrowsSubject.next();
  }

  private getEvolutionRelationships(): Map<string, DeckItem[]> {
    const relationships = new Map<string, DeckItem[]>();

    // Create a map of cards by name for quick lookup
    const cardsByName = new Map<string, DeckItem[]>();
    this.tempList.forEach(item => {
      if (item.card.superType === SuperType.POKEMON) {
        const pokemonCard = item.card as PokemonCard;
        const name = pokemonCard.name;
        if (!cardsByName.has(name)) {
          cardsByName.set(name, []);
        }
        cardsByName.get(name)!.push(item);
      }
    });

    // Find evolution relationships
    this.tempList.forEach(item => {
      if (item.card.superType === SuperType.POKEMON) {
        const pokemonCard = item.card as PokemonCard;
        const evolutions: DeckItem[] = [];

        // Check evolvesTo relationships
        if (pokemonCard.evolvesTo && pokemonCard.evolvesTo.length > 0) {
          pokemonCard.evolvesTo.forEach(evolutionName => {
            const evolutionCards = cardsByName.get(evolutionName);
            if (evolutionCards) {
              evolutions.push(...evolutionCards);
            }
          });
        }

        // Also check if this card evolves from another (reverse relationship)
        // We'll handle this by checking evolvesFrom on other cards
        if (pokemonCard.evolvesFrom) {
          const preEvolutionCards = cardsByName.get(pokemonCard.evolvesFrom);
          if (preEvolutionCards) {
            preEvolutionCards.forEach(preEvo => {
              const key = preEvo.card.fullName;
              if (!relationships.has(key)) {
                relationships.set(key, []);
              }
              if (!relationships.get(key)!.some(e => e.card.fullName === item.card.fullName)) {
                relationships.get(key)!.push(item);
              }
            });
          }
        }

        // Add evolvesTo relationships
        if (evolutions.length > 0) {
          relationships.set(item.card.fullName, evolutions);
        }
      }
    });

    return relationships;
  }

  private getCardElementPositions(): Map<string, DOMRect> {
    const positions = new Map<string, DOMRect>();

    if (!this.deckPane || !this.deckPane.nativeElement) {
      return positions;
    }

    const deckPaneRect = this.deckPane.nativeElement.getBoundingClientRect();
    const cardElements = this.deckPane.nativeElement.querySelectorAll('.deck-card-inline');

    // Match cards by index as fallback if attribute is missing
    cardElements.forEach((element: HTMLElement, index: number) => {
      let fullName = element.getAttribute('data-card-fullname');

      // Fallback: match by index in tempList
      if (!fullName && index < this.tempList.length) {
        const deckItem = this.tempList[index];
        if (deckItem && deckItem.card) {
          fullName = deckItem.card.fullName;
        }
      }

      if (fullName) {
        const rect = element.getBoundingClientRect();

        // Find the actual ptcg-card element to get its horizontal center (matches counter position)
        // Use only horizontal position from ptcg-card, keep vertical from container
        const cardElement = element.querySelector('ptcg-card') as HTMLElement;
        let cardLeft = rect.left;
        let cardWidth = rect.width;

        if (cardElement) {
          const cardRect = cardElement.getBoundingClientRect();
          cardLeft = cardRect.left;
          cardWidth = cardRect.width;
        }

        // Convert to relative coordinates within deck pane
        // Use object literal instead of DOMRect constructor for better compatibility
        const relativeRect = {
          left: cardLeft - deckPaneRect.left,
          top: rect.top - deckPaneRect.top,
          width: cardWidth,
          height: rect.height,
          right: (cardLeft + cardWidth) - deckPaneRect.left,
          bottom: rect.bottom - deckPaneRect.top
        } as DOMRect;
        positions.set(fullName, relativeRect);
      }
    });

    return positions;
  }

  private drawEvolutionArrows() {
    if (!this.evolutionArrows || !this.evolutionArrows.nativeElement || !this.deckPane) {
      return;
    }

    const svg = this.evolutionArrows.nativeElement;
    const relationships = this.getEvolutionRelationships();
    const positions = this.getCardElementPositions();

    // Clear existing arrows (keep defs)
    const existingPaths = svg.querySelectorAll('path, line');
    existingPaths.forEach(path => path.remove());

    // Set SVG size to match deck pane, with padding for arrows that go above cards
    const deckPaneRect = this.deckPane.nativeElement.getBoundingClientRect();
    const padding = 12; // Extra space above for "overtop" arrows
    svg.setAttribute('width', deckPaneRect.width.toString());
    svg.setAttribute('height', (deckPaneRect.height + padding).toString());
    // ViewBox starts at -padding to show space above, and we position SVG to align coordinates
    // When SVG is at top: -padding and viewBox starts at -padding, y=0 aligns with deck pane
    svg.setAttribute('viewBox', `0 -${padding} ${deckPaneRect.width} ${deckPaneRect.height + padding}`);
    // Position SVG to extend upward - this aligns y=0 in viewBox with y=0 in deck pane
    (svg as any).style.top = `${-padding}px`;

    // Draw arrows for each relationship
    relationships.forEach((evolutions, fromCardFullName) => {
      const fromPosition = positions.get(fromCardFullName);
      if (!fromPosition || evolutions.length === 0) {
        return;
      }

      // Find the source card to determine its stage
      const fromCardItem = this.tempList.find(item => item.card.fullName === fromCardFullName);
      if (!fromCardItem || fromCardItem.card.superType !== SuperType.POKEMON) {
        return;
      }

      const fromPokemonCard = fromCardItem.card as PokemonCard;
      const fromStage = fromPokemonCard.stage;
      const isBasic = fromStage === Stage.BASIC;

      // Reduced spacing - arrows stay very close to cards
      const verticalSpacing = 8; // Small spacing to keep arrows close
      const horizontalSpacing = 5; // Minimal horizontal extension
      const arrowOverlap = 3; // Amount to extend arrow into card area

      // Calculate start point based on stage - ensure perfect horizontal centering
      const startX = Math.round((fromPosition.left + fromPosition.width / 2) * 100) / 100;
      let startY: number;

      if (isBasic) {
        // Basic → Stage 1: Start from top, go up (overtop), then down
        startY = fromPosition.top;
      } else {
        // Stage 1 → Stage 2: Start from bottom, go down, then up
        startY = fromPosition.top + fromPosition.height + 4; // Move down 4px
      }

      if (evolutions.length === 1) {
        // Single evolution
        const toPosition = positions.get(evolutions[0].card.fullName);
        if (!toPosition) {
          return;
        }

        const endX = Math.round((toPosition.left + toPosition.width / 2) * 100) / 100;
        let endY: number;
        let pathD: string;

        if (isBasic) {
          // Basic → Stage 1: Go up slightly (overtop), then down to top of target
          const midY = startY - verticalSpacing; // Go up from source (small amount)
          endY = toPosition.top + arrowOverlap; // Extend into card area so arrowhead overlaps
          pathD = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
        } else {
          // Stage 1 → Stage 2: Go down slightly, then up to bottom of target
          const midY = startY + verticalSpacing; // Go down from source (small amount)
          endY = toPosition.top + toPosition.height - arrowOverlap + 4; // Extend into card area so arrowhead overlaps, moved down 4px
          pathD = `M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`;
        }

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathD);
        path.setAttribute('stroke', '#FFD700');
        path.setAttribute('stroke-width', '2.5');
        path.setAttribute('fill', 'none');
        path.setAttribute('marker-end', 'url(#arrowhead)');
        svg.appendChild(path);
      } else {
        // Multiple evolutions - split arrow
        const validEvolutions = evolutions.filter(e => positions.has(e.card.fullName));
        if (validEvolutions.length === 0) {
          return;
        }

        // Calculate positions for all target cards
        const targetPositions = validEvolutions.map(e => ({
          card: e,
          position: positions.get(e.card.fullName)!
        }));

        // Sort targets by X position
        targetPositions.sort((a, b) => a.position.left - b.position.left);

        let midY: number;
        let horizontalY: number;

        if (isBasic) {
          // Basic → Stage 1: Go up, then horizontal, then down to each target
          midY = startY - verticalSpacing; // Go up from source
          horizontalY = midY;
        } else {
          // Stage 1 → Stage 2: Go down, then horizontal, then up to each target
          midY = startY + verticalSpacing; // Go down from source
          horizontalY = midY;
        }

        // Draw horizontal line - connect exactly to vertical lines without extending beyond
        const leftmostX = Math.min(...targetPositions.map(t => t.position.left + t.position.width / 2));
        const rightmostX = Math.max(...targetPositions.map(t => t.position.left + t.position.width / 2));
        // Horizontal line should start at the leftmost connection point and end at the rightmost
        // Include the source card's X position in the calculation
        const horizontalStartX = Math.min(startX, leftmostX);
        const horizontalEndX = Math.max(startX, rightmostX);

        // Main vertical line from source
        const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainPath.setAttribute('d', `M ${startX} ${startY} L ${startX} ${horizontalY}`);
        mainPath.setAttribute('stroke', '#FFD700');
        mainPath.setAttribute('stroke-width', '2.5');
        mainPath.setAttribute('fill', 'none');
        svg.appendChild(mainPath);

        // Horizontal line - extend slightly to ensure full stroke rendering at endpoints
        // The vertical lines will overlap and cover the extended portion
        const horizontalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const strokeHalfWidth = 1.25; // Half of stroke-width 2.5
        // Extend by half stroke width on each side so full stroke is visible at connection points
        horizontalPath.setAttribute('d', `M ${horizontalStartX - strokeHalfWidth} ${horizontalY} L ${horizontalEndX + strokeHalfWidth} ${horizontalY}`);
        horizontalPath.setAttribute('stroke', '#FFD700');
        horizontalPath.setAttribute('stroke-width', '2.5');
        horizontalPath.setAttribute('stroke-linecap', 'butt');
        horizontalPath.setAttribute('fill', 'none');
        svg.appendChild(horizontalPath);

        // Draw branches to each evolution
        targetPositions.forEach((target) => {
          const targetX = Math.round((target.position.left + target.position.width / 2) * 100) / 100;
          let targetY: number;
          let extendedY: number;

          if (isBasic) {
            // Basic → Stage 1: End at top of target, extend upward to match other vertical lines
            // Arrow should point downward, so final segment must go down
            targetY = target.position.top + arrowOverlap; // Extend into card area so arrowhead overlaps
            // Extend upward (toward horizontalY) to match visual weight, then final segment goes down
            extendedY = target.position.top - verticalSpacing; // Extend above the card edge
            // Path goes: horizontalY (top) → extendedY (above card) → targetY (into card)
            // Final segment goes downward, ensuring arrowhead points down
          } else {
            // Stage 1 → Stage 2: End at bottom of target, extend downward to match other vertical lines
            // Arrow should point upward, so final segment must go up
            targetY = target.position.top + target.position.height - arrowOverlap + 4; // Extend into card area so arrowhead overlaps, moved down 4px
            // Extend downward (toward horizontalY) to match visual weight, then final segment goes up
            extendedY = target.position.top + target.position.height + verticalSpacing + 4; // Extend below the card edge, moved down 4px
            // Path goes: horizontalY (bottom) → extendedY (below card) → targetY (into card)
            // Final segment goes upward, ensuring arrowhead points up
          }

          // Vertical line to target - extend to match the height of other vertical segments
          const branchPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          if (isBasic) {
            // For Basic → Stage 1: Draw from top down to extendedY (above card), then down to targetY
            // Final segment goes downward, making arrowhead point down
            branchPath.setAttribute('d', `M ${targetX} ${horizontalY} L ${targetX} ${extendedY} L ${targetX} ${targetY}`);
          } else {
            // For Stage 1 → Stage 2: Draw from bottom up to extendedY (below card), then up to targetY
            // Final segment goes upward, making arrowhead point up
            branchPath.setAttribute('d', `M ${targetX} ${horizontalY} L ${targetX} ${extendedY} L ${targetX} ${targetY}`);
          }
          branchPath.setAttribute('stroke', '#FFD700');
          branchPath.setAttribute('stroke-width', '2.5');
          branchPath.setAttribute('fill', 'none');
          branchPath.setAttribute('marker-end', 'url(#arrowhead)');
          svg.appendChild(branchPath);
        });
      }
    });
  }

  private updateArrows() {
    if (!this.deckPane || !this.evolutionArrows) {
      return;
    }

    // Use requestAnimationFrame for smooth updates
    requestAnimationFrame(() => {
      this.drawEvolutionArrows();
    });
  }
}