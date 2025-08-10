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
export class DeckEditPanesComponent implements OnInit, OnDestroy {

  @Input() toolbarFilter: DeckEditToolbarFilter;
  @Output() deckItemsChange = new EventEmitter<DeckItem[]>();
  public showLibrary = true;

  @Input() set deckItems(value: DeckItem[]) {
    this.list = value;
    this.tempList = this.sortByPokemonEvolution([...value]);
    this.updateDeckFormats();
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

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private ngZone: NgZone,
    private dnd: DndService,
    private translate: TranslateService,
    private deckService: DeckService
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
        this.tempList = this.sortByPokemonEvolution([...this.list]);
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
    const firstTrainerIndex = cards.findIndex((d) => d.card.superType === SuperType.TRAINER);

    for (let i = 0; i < firstTrainerIndex; i++) {
      const pokemonCard = cards[i].card as PokemonCard;
      if (pokemonCard.evolvesFrom) {
        const indexOfPrevolution = this.findLastIndex(cards, c => c.card.name === pokemonCard.evolvesFrom);

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
      // Also handle evolvesTo relationships
      else if (pokemonCard.evolvesTo && pokemonCard.evolvesTo.length > 0) {
        // Find the first evolution that exists in the deck
        for (const evolutionName of pokemonCard.evolvesTo) {
          const indexOfEvolution = this.findLastIndex(cards, c => c.card.name === evolutionName);

          if (indexOfEvolution !== -1 && cards[indexOfEvolution]?.card.superType === SuperType.POKEMON) {
            const currentPokemon = { ...cards.splice(i, 1)[0] };

            cards = [
              ...cards.slice(0, indexOfEvolution),
              { ...currentPokemon },
              ...cards.slice(indexOfEvolution),
            ];
            break;
          }
        }
      }
    }

    return cards;
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
  }

  private sortDeckCards(cards: DeckItem[]): DeckItem[] {
    // First, separate Pokemon from non-Pokemon cards
    const pokemonCards = cards.filter(item => item.card.superType === SuperType.POKEMON);
    const nonPokemonCards = cards.filter(item => item.card.superType !== SuperType.POKEMON);

    // Sort non-Pokemon cards by supertype
    const sortedNonPokemon = nonPokemonCards.sort((a, b) => {
      return this.compareSupertype(a.card.superType) - this.compareSupertype(b.card.superType);
    });

    // For Pokemon cards, first identify all evolution chains
    const evolutionChains = new Map<string, DeckItem[]>();
    const basicPokemon = new Set<string>();
    const evolutionCards = new Set<string>();

    // First pass: identify all evolution relationships
    pokemonCards.forEach(item => {
      const pokemonCard = item.card as PokemonCard;
      if (pokemonCard.evolvesFrom) {
        basicPokemon.add(pokemonCard.evolvesFrom);
        evolutionCards.add(pokemonCard.name);
        // Also add the evolved form to evolutionCards
        evolutionCards.add(pokemonCard.evolvesFrom);
      }
      // Also check evolvesTo relationships
      if (pokemonCard.evolvesTo && pokemonCard.evolvesTo.length > 0) {
        pokemonCard.evolvesTo.forEach(evolutionName => {
          evolutionCards.add(evolutionName);
          evolutionCards.add(pokemonCard.name);
        });
      }
    });

    // Second pass: build evolution chains
    pokemonCards.forEach(item => {
      const pokemonCard = item.card as PokemonCard;
      let chainKey = pokemonCard.name;

      // If this Pokemon evolves from another, use that as the chain key
      if (pokemonCard.evolvesFrom) {
        chainKey = pokemonCard.evolvesFrom;
      }
      // If this is a basic Pokemon that others evolve from, use its name as the chain key
      else if (basicPokemon.has(pokemonCard.name)) {
        chainKey = pokemonCard.name;
      }
      // If this Pokemon is part of an evolution chain but not a basic, find its basic
      else if (evolutionCards.has(pokemonCard.name)) {
        // Find the basic Pokemon this evolves from
        const basic = pokemonCards.find(p => {
          const pCard = p.card as PokemonCard;
          return pCard.evolvesFrom === pokemonCard.name;
        });
        if (basic) {
          chainKey = basic.card.name;
        }
        // Also check if this Pokemon can evolve into others (evolvesTo)
        else if (pokemonCard.evolvesTo && pokemonCard.evolvesTo.length > 0) {
          // Use this Pokemon as the chain key if it can evolve into others
          chainKey = pokemonCard.name;
        }
      }

      if (!evolutionChains.has(chainKey)) {
        evolutionChains.set(chainKey, []);
      }
      evolutionChains.get(chainKey)!.push(item);
    });

    // Sort each evolution chain
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

    evolutionChains.forEach(chain => {
      chain.sort((a, b) => {
        const pokemonA = a.card as PokemonCard;
        const pokemonB = b.card as PokemonCard;
        const aIndex = stageOrder.indexOf(pokemonA.stage);
        const bIndex = stageOrder.indexOf(pokemonB.stage);

        // If they're in the same evolution chain, sort by stage
        if (pokemonA.evolvesFrom === pokemonB.name || pokemonB.evolvesFrom === pokemonA.name ||
          (pokemonA.evolvesTo && pokemonA.evolvesTo.includes(pokemonB.name)) ||
          (pokemonB.evolvesTo && pokemonB.evolvesTo.includes(pokemonA.name))) {
          return aIndex - bIndex;
        }

        // If they're not in the same chain, but one is a basic that others evolve from
        if (basicPokemon.has(pokemonA.name) && !basicPokemon.has(pokemonB.name)) return -1;
        if (!basicPokemon.has(pokemonA.name) && basicPokemon.has(pokemonB.name)) return 1;

        // If neither is a basic that others evolve from, sort by stage first
        if (aIndex !== bIndex) {
          return aIndex - bIndex;
        }

        // If same stage, sort alphabetically
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

    // Sort chains alphabetically by their basic Pokemon
    const sortedChains = Array.from(evolutionChains.entries())
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([_, chain]) => chain)
      .flat();

    // Combine everything in the correct order: evolution chains, then non-evolution Pokemon, then non-Pokemon
    return [...sortedChains, ...sortedNonEvolutionPokemon, ...sortedNonPokemon];
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
  }

  ngOnDestroy() {
    this.deckTarget.unsubscribe();
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
}