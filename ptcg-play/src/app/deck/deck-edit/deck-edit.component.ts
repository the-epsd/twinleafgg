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
import { Card, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType, Archetype, Format } from 'ptcg-server';
import { cardReplacements, exportReplacements, setCodeReplacements } from './card-replacements';
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
  public selectedArtworks: { code: string; artworkId?: number }[] = [];

  constructor(
    private alertService: AlertService,
    private cardsBaseService: CardsBaseService,
    private deckService: DeckService,
    // private fileDownloadService: FileDownloadService,
    private route: ActivatedRoute,
    private router: Router,
    private translate: TranslateService
  ) { }



  ngOnInit() {
    // this.setupAutoSave();
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
        // Load artworks if present
        this.selectedArtworks = response.deck.artworks || [];
        // Detect theme deck
        this.isThemeDeck = Array.isArray(this.deck.format) && this.deck.format.includes(Format['THEME']);
      }, async () => {
        await this.alertService.confirm(this.translate.instant('DECK_EDIT_LOADING_ERROR'));
        this.router.navigate(['/decks']);
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
    // First, separate cards by type
    const pokemonCards = cards.filter(d => d.card.superType === SuperType.POKEMON);
    const nonPokemonCards = cards.filter(d => d.card.superType !== SuperType.POKEMON);

    // Sort Pokemon by evolution
    for (let i = pokemonCards.length - 1; i >= 0; i--) {
      if ((<PokemonCard>pokemonCards[i].card).evolvesFrom) {
        const indexOfPrevolution = this.findLastIndex(
          pokemonCards,
          c => c.card.name === (<PokemonCard>pokemonCards[i].card).evolvesFrom
        );

        if (indexOfPrevolution === -1) {
          continue;
        }

        const currentPokemon = { ...pokemonCards.splice(i, 1)[0] };

        pokemonCards.splice(indexOfPrevolution + 1, 0, currentPokemon);
      }
    }

    // Recombine the cards in the correct order
    return [...pokemonCards, ...nonPokemonCards];
  }

  findLastIndex<T>(array: Array<T>, predicate: (value: T, index: number, obj: T[]) => boolean): number {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array[i], i, array))
        return i;
    }
    return -1;
  }

  importFromClipboard() {
    navigator.clipboard.readText()
      .then(text => {
        // Expect lines like: '4 Pikachu BSS 58'
        const cardDetails = text.split('\n')
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
        this.importDeck(cardDetails);
      });
  }

  public importDeck(cardDetails: { name: string, set: string, setNumber: string }[]) {
    const failedImports: string[] = [];
    const failedCardCounts = new Map<string, number>();

    const successfulCards = cardDetails.map(card => {
      const { name, set, setNumber } = card;
      // Check if card exists in database
      if (!this.cardsBaseService.getCardByNameSetNumber(name, set, setNumber)) {
        const key = `${name} ${set} ${setNumber}`;
        failedCardCounts.set(key, (failedCardCounts.get(key) || 0) + 1);
      }
      return this.cardsBaseService.getCardByNameSetNumber(name, set, setNumber)?.fullName;
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

    this.loading = true;
    this.deckService.saveDeck(
      this.deck.id,
      this.deck.name,
      items,
      this.deck.manualArchetype1 as Archetype,
      this.deck.manualArchetype2 as Archetype,
      this.selectedArtworks
    ).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
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