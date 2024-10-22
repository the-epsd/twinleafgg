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
import { Card, PokemonCard, SuperType } from 'ptcg-server';
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
      }, async error => {
        await this.alertService.error(this.translate.instant('DECK_EDIT_LOADING_ERROR'));
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
          deckItems.sort((a, b) => a.card.fullName.localeCompare(b.card.fullName));
          deckItems.sort((a, b) => a.card.superType - b.card.superType);
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
    this.deckItems = this.loadDeckItems(cardDetails.map(card => {
      const parts = card.cardName.split(' ');
      return parts.slice(0, -1).join(' '); // Remove set number for loadDeckItems
    }));
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
      console.log('Deck saved incrementally');
    }, (error: ApiError) => {
      if (!error.handled) {
        this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
      }
    });
  }
}