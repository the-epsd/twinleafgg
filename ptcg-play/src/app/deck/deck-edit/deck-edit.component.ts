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
import { Card, EnergyCard, EnergyType, PokemonCard, SuperType, TrainerCard, TrainerType } from 'ptcg-server';
import { cardReplacements, exportReplacements } from './card-replacements';
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
    const firstTrainerIndex = cards.findIndex((d) => d.card.superType === SuperType.TRAINER);

    for (let i = firstTrainerIndex - 1; i >= 0; i--) {
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
        const cardNames = text.split('\n')
          .filter(line => !!line)
          .flatMap(line => {
            const parts = line.split(' ');
            const count = parseInt(parts[0], 10);
            if (isNaN(count)) {
              return [];
            }
            const cardDetails = parts.slice(1);
            const cardName = cardDetails.slice(0, -1).join(' ');
            const setNumber = cardDetails.slice(-1)[0];
            const fullCardName = `${cardName} ${setNumber}`;

            // Apply card replacements
            const replacement = cardReplacements.find(r => r.from === fullCardName);
            const finalCardName = replacement ? replacement.to : fullCardName;

            return new Array(count).fill({ cardName: finalCardName });
          });

        this.importDeck(cardNames);
      });
  }

  public importDeck(cardDetails: { cardName: string }[]) {
    const failedImports: string[] = [];
    const failedCardCounts = new Map<string, number>();

    const successfulCards = cardDetails.map(card => {
      const parts = card.cardName.split(' ');
      const cardName = parts.slice(0, -1).join(' ');

      // Check if card exists in database
      if (!this.cardsBaseService.getCardByName(cardName)) {
        failedCardCounts.set(card.cardName, (failedCardCounts.get(card.cardName) || 0) + 1);
      }

      return cardName;
    }).filter(name => this.cardsBaseService.getCardByName(name));

    this.deckItems = this.loadDeckItems(successfulCards);

    if (failedCardCounts.size > 0) {
      const formattedFailures = Array.from(failedCardCounts.entries())
        .map(([cardName, count]) => `${count} ${cardName}`);
      const message = `${this.translate.instant('FAILED_IMPORTS')}:\n${formattedFailures.join('\n')}`;
      this.alertService.alert(this.translate.instant('IMPORT_RESULTS'), message, []);
    }
  }

  public async exportDeck() {
    const cardNames = [];
    for (const item of this.deckItems) {
      let fullNameWithSetNumber = item.card.fullName + (item.card.setNumber ? ` ${item.card.setNumber}` : '');

      // Apply export replacements
      const replacement = exportReplacements.find(r => r.from === fullNameWithSetNumber);
      if (replacement) {
        fullNameWithSetNumber = replacement.to;
      }

      const fullCardName = `${item.count} ${fullNameWithSetNumber}`;

      if (!cardNames.includes(fullCardName)) {
        cardNames.push(fullCardName);
      }
    }
    const data = cardNames.join('\n') + '\n';

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
    this.deckService.saveDeck(this.deck.id, this.deck.name, items).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.alertService.toast(this.translate.instant('DECK_EDIT_SAVED'));
      // Consider using a less intrusive notification for incremental saves
      // console.log('Deck saved incrementally');
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