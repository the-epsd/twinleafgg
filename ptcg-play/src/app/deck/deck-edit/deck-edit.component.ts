import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, finalize, debounceTime } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { AlertService } from '../../shared/alert/alert.service';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { Deck } from '../../api/interfaces/deck.interface';
import { DeckItem } from '../deck-card/deck-card.interface';
import { DeckEditPane } from '../deck-edit-panes/deck-edit-pane.interface';
import { DeckEditToolbarFilter } from '../deck-edit-toolbar/deck-edit-toolbar-filter.interface';
import { DeckService } from '../../api/services/deck.service';
// import { FileDownloadService } from '../../shared/file-download/file-download.service';
import { Card, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType, Archetype, Format, Stage, CardType, ApiErrorEnum } from 'ptcg-server';
import { cardReplacements, exportReplacements, setCodeReplacements } from './card-replacements';
import { SleeveService } from 'src/app/api/services/sleeve.service';
import { SleeveInfo } from 'src/app/api/interfaces/sleeve.interface';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { SleeveSelectPopupComponent } from '../sleeve-select-popup/sleeve-select-popup.component';
import { ArchetypeDetectionService } from '../archetype-detection/archetype-detection.service';
import { ArchetypeUtils } from '../deck-archetype-service/archetype.utils';
// import { interval, Subject, Subscription } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {
  // private ngUnsubscribe = new Subject<void>();
  // private autoSaveSubscription: Subscription;
  public loading = false;
  public deck: Deck;
  public deckItems: DeckItem[] = [];
  public toolbarFilter: DeckEditToolbarFilter;
  public DeckEditPane = DeckEditPane;
  public isThemeDeck = false;
  public sleeves: SleeveInfo[] = [];
  public selectedSleeveIdentifier?: string;

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    private sleeveService: SleeveService,
    private dialog: MatDialog,
    // private fileDownloadService: FileDownloadService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private archetypeDetectionService: ArchetypeDetectionService
  ) {
    // Initialize ArchetypeUtils with the detection service for static access
    ArchetypeUtils.setDetectionService(archetypeDetectionService);
  }



  ngOnInit() {
    // this.setupAutoSave();

    this.sleeveService.getList()
      .pipe(untilDestroyed(this))
      .subscribe(resp => {
        this.sleeves = resp.sleeves || [];
      }, () => { this.sleeves = []; });

    this.route.paramMap.pipe(
      switchMap(paramMap => {
        this.loading = true;
        const deckId = parseInt(paramMap.get('deckId'), 10);
        return this.deckService.getDeck(deckId);
      }),
      untilDestroyed(this)
    )
      .subscribe(response => {
        this.loading = false;
        this.deck = response.deck;
        this.deckItems = this.loadDeckItems(response.deck.cards);
        this.selectedSleeveIdentifier = response.deck.sleeveIdentifier || undefined;
        // Detect theme deck
        this.isThemeDeck = Array.isArray(this.deck.format) && this.deck.format.includes(Format['THEME']);

        // If navigated with clipboard text in state (Create from Clipboard flow), import and save
        const clipboardText = history.state?.importFromClipboard as string | undefined;
        if (clipboardText) {
          this.importFromClipboardText(clipboardText);
          this.saveDeck();
          history.replaceState({}, '', window.location.href);
        }
      }, async () => {
        await this.alertService.confirm(this.translate.instant('DECK_EDIT_LOADING_ERROR'));
        this.router.navigate(['/deck']);
      });
  }

  // private setupAutoSave() {
  //   this.autoSaveSubscription = interval(15000)
  //     .pipe(
  //       takeUntil(this.ngUnsubscribe)
  //     )
  //     .subscribe(() => {
  //       this.saveDeck();
  //     });
  // }

  // ngOnDestroy() {
  //   // ... existing ngOnDestroy code
  //   if (this.autoSaveSubscription) {
  //     this.autoSaveSubscription.unsubscribe();
  //   }
  // }

  public clearDeck() {
    this.deckItems = [];
  }

  private loadDeckItems(cardNames: string[]): DeckItem[] {
    const itemMap: { [name: string]: DeckItem } = {};
    let deckItems: DeckItem[] = [];

    for (const name of cardNames) {
      if (itemMap[name] !== undefined) {
        itemMap[name].count++;
      } else {
        const card = this.cardsBaseService.getCardByName(name);
        if (card !== undefined) {
          itemMap[name] = {
            card,
            count: 1,
            pane: DeckEditPane.DECK,
            scanUrl: this.cardsBaseService.getScanUrl(card),
          };
          deckItems.push(itemMap[name]);

          deckItems.sort((a, b) => {
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

        }
      }
    }

    deckItems = this.sortByPokemonEvolution(deckItems);

    return deckItems;
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
    const compareCardType = (cardType: CardType) => {
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

    const sortedNonEvolutionPokemon = nonEvolutionPokemon.sort((a, b) => {
      const pokemonA = a.card as PokemonCard;
      const pokemonB = b.card as PokemonCard;

      // First sort by card type
      const typeCompare = compareCardType(pokemonA.cardType) - compareCardType(pokemonB.cardType);
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
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i], i, array))
        return i;
    }
    return -1;
  }

  private parseClipboardLines(text: string): { name: string, set: string, setNumber: string }[] {
    return text.split('\n')
      .filter(line => !!line)
      .flatMap(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length < 4) {
          return [];
        }
        const count = parseInt(parts[0], 10);
        if (isNaN(count)) {
          return [];
        }
        const setNumber = parts.pop();
        const set = parts.pop();
        const name = parts.slice(1).join(' ');
        return new Array(count).fill({ name, set, setNumber });
      });
  }

  importFromClipboard(): Promise<void> {
    return navigator.clipboard.readText()
      .then(text => {
        this.importFromClipboardText(text);
      });
  }

  importFromClipboardText(text: string): void {
    const cardDetails = this.parseClipboardLines(text);
    this.importDeck(cardDetails);
  }

  private getSaveErrorMessage(error: ApiError): string {
    switch (error.code) {
      case ApiErrorEnum.DECK_INVALID:
        return this.translate.instant('ERROR_DECK_INVALID');
      case ApiErrorEnum.NAME_DUPLICATE:
        return this.translate.instant('ERROR_DECK_NAME_DUPLICATE');
      case ApiErrorEnum.VALIDATION_INVALID_PARAM:
        return this.translate.instant('ERROR_DECK_SAVE_CARDS_INVALID');
      default:
        return this.translate.instant('ERROR_UNKNOWN');
    }
  }

  public importDeck(cardDetails: { name: string, set: string, setNumber: string }[]) {
    const failedImports: string[] = [];
    const failedCardCounts = new Map<string, number>();

    const successfulCards = cardDetails.map(card => {
      const { name, set, setNumber } = card;

      // Apply card replacements to the name
      let processedName = name;
      for (const replacement of cardReplacements) {
        processedName = processedName.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
      }

      // First try: exact match with name, set, and setNumber
      let foundCard = this.cardsBaseService.getCardByNameSetNumber(processedName, set, setNumber);

      // Second try: match by name and set (ignore setNumber)
      if (!foundCard) {
        foundCard = this.cardsBaseService.getCardByNameSet(processedName, set);
      }

      // Third try: match by name only (ignore set and setNumber)
      if (!foundCard) {
        foundCard = this.cardsBaseService.getCardByBaseName(processedName);
      }

      // Check for favorite card if a match was found
      if (foundCard) {
        const favoriteFullName = this.cardsBaseService.getFavoriteCard(processedName);
        if (favoriteFullName) {
          const favoriteCard = this.cardsBaseService.getCardByName(favoriteFullName);
          if (favoriteCard) {
            foundCard = favoriteCard;
          }
        }
      }

      if (!foundCard) {
        const key = `${name} ${set} ${setNumber}`;
        failedCardCounts.set(key, (failedCardCounts.get(key) || 0) + 1);
      }

      return foundCard?.fullName;
    }).filter(name => !!name);

    this.deckItems = this.loadDeckItems(successfulCards as string[]);

    if (failedCardCounts.size > 0) {
      const formattedFailures = Array.from(failedCardCounts.entries())
        .map(([cardName, count]) => `${count} ${cardName}`);
      const message = `${this.translate.instant('FAILED_IMPORTS')}:\n${formattedFailures.join('\n')}`;
      this.alertService.alert(this.translate.instant('IMPORT_RESULTS'), message, []);
    }
  }

  public async exportDeck() {
    const cardLines = [];
    for (const item of this.deckItems) {
      const card = item.card;
      const line = `${item.count} ${card.name} ${card.set} ${card.setNumber}`;
      if (!cardLines.includes(line)) {
        cardLines.push(line);
      }
    }
    const data = cardLines.join('\n') + '\n';

    try {
      await navigator.clipboard.writeText(data);
      this.alertService.toast(this.translate.instant('DECK_EXPORTED_TO_CLIPBOARD'));
    } catch (error) {
      this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
    }
  }

  // Modify the existing saveDeck method to be more suitable for incremental saves
  public saveDeck() {
    if (!this.deck) {
      return;
    }

    const items = this.deckItems.flatMap(item => Array(item.count).fill(item.card.fullName));

    // Auto-detect archetypes if none are manually set
    let archetype1 = this.deck.manualArchetype1 as Archetype | undefined;
    let archetype2 = this.deck.manualArchetype2 as Archetype | undefined;

    if (!archetype1 && !archetype2 && this.deckItems.length > 0) {
      const [detected1, detected2] = this.archetypeDetectionService.getSuggestedArchetypes(this.deckItems);
      archetype1 = detected1 || undefined;
      archetype2 = detected2 || undefined;
    }

    this.loading = true;
    this.deckService.saveDeck(
      this.deck.id,
      this.deck.name,
      items,
      archetype1,
      archetype2,
      undefined,
      this.selectedSleeveIdentifier
    ).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
    }, (error: ApiError) => {
      if (!error.handled) {
        console.error('[Deck] saveDeck failed', error);
        const message = this.getSaveErrorMessage(error);
        this.alertService.toast(message);
      }
    });
  }


  public openSleeveSelector() {
    if (this.isThemeDeck || this.loading || !this.deck) {
      return;
    }
    const dialogRef = this.dialog.open(SleeveSelectPopupComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {
        sleeves: this.sleeves,
        selectedIdentifier: this.selectedSleeveIdentifier
      }
    });
    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result === undefined) {
        return;
      }
      this.selectedSleeveIdentifier = result || undefined;
      this.deck.sleeveIdentifier = this.selectedSleeveIdentifier;
      this.saveDeck();
    });
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
}