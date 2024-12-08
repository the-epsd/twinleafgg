import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiError } from '../api/api.error';
import { DeckListEntry } from '../api/interfaces/deck.interface';
import { DeckService } from '../api/services/deck.service';
import { AlertService } from '../shared/alert/alert.service';
import { CardsBaseService } from '../shared/cards/cards-base.service';
import { DeckItem } from './deck-card/deck-card.interface';
import { Archetype, CardType } from 'ptcg-server';
import { ArchetypeService } from './deck-archetype-service/archetype.service';
import { ArchetypeUtils } from './deck-archetype-service/archetype.utils';

@UntilDestroy()

@Component({
  selector: 'ptcg-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss']
})
export class DeckComponent implements OnInit {

  public displayedColumns: string[] = ['name', 'formats', 'cardTypes', 'isValid', 'actions'];
  public decks: DeckListEntry[] = [];
  public loading = false;
  public defaultDeckId: number | null = null;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private cardsBaseService: CardsBaseService,
    private translate: TranslateService,
    private router: Router,
    private archetypeService: ArchetypeService,
  ) { }

  public ngOnInit() {
    this.refreshList();
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      this.defaultDeckId = parseInt(savedDefaultDeckId, 10);
    }
  }

  // Add to existing menu items
  public async setAsDefault(deckId: number) {
    this.defaultDeckId = deckId;
    // Save to localStorage or your backend
    localStorage.setItem('defaultDeckId', deckId.toString());
    this.alertService.toast(this.translate.instant('DECK_SET_AS_DEFAULT'));
  }

  private refreshList() {
    this.loading = true;
    this.deckService.getList().pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    )
      .subscribe(response => {
        this.decks = response.decks;

        this.decks.forEach(deck => {
          const deckCards: DeckItem[] = [];
          deck.cards.forEach(card => {
            deckCards.push({
              card: this.cardsBaseService.getCardByName(card),
              count: 0,
              pane: null,
              scanUrl: null
            });
          });

          deck.deckItems = deckCards;
        });
      }, (error: ApiError) => {
        this.handleError(error);
      });
  }

  public async createDeck() {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.createDeck(name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(
      (response) => {
        // Navigate to the deck editor with the new deck ID
        this.router.navigate(['/deck', response.deck.id]);
        this.refreshList();
      },
      (error: ApiError) => {
        this.handleError(error);
      }
    );
  }

  public exportDeckList(deck: DeckListEntry): void {
    const deckList = this.generateDeckList(deck);
    navigator.clipboard.writeText(deckList).then(() => {
      this.alertService.toast(this.translate.instant('DECK_EXPORTED_TO_CLIPBOARD'));
    });
  }

  private generateDeckList(deck: DeckListEntry): string {
    const cardCounts = new Map<string, number>();
    deck.deckItems.forEach(item => {
      const cardName = `${item.card.name} ${item.card.set} ${item.card.setNumber}`;
      cardCounts.set(cardName, (cardCounts.get(cardName) || 0) + 1);
    });

    return Array.from(cardCounts.entries())
      .map(([cardName, count]) => `${count} ${cardName}`)
      .join('\n');
  }

  public async deleteDeck(deckId: number) {
    if (!await this.alertService.confirm(this.translate.instant('DECK_DELETE_SELECTED'))) {
      return;
    }
    this.loading = true;
    this.deckService.deleteDeck(deckId).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  public async renameDeck(deckId: number, previousName: string) {
    const name = await this.getDeckName(previousName);
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.rename(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  public async duplicateDeck(deckId: number) {
    const name = await this.getDeckName();
    if (name === undefined) {
      return;
    }

    this.loading = true;
    this.deckService.duplicate(deckId, name).pipe(
      finalize(() => { this.loading = false; }),
      untilDestroyed(this)
    ).subscribe(() => {
      this.refreshList();
    }, (error: ApiError) => {
      this.handleError(error);
    });
  }

  private getDeckName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.decks.map(d => d.name);
    return this.alertService.inputName({
      title: this.translate.instant('DECK_ENTER_NAME_TITLE'),
      placeholder: this.translate.instant('DECK_ENTER_NAME_INPUT'),
      invalidValues,
      value: name
    });
  }

  getArchetype(deckItems: any[]): Archetype {
    return ArchetypeUtils.getArchetype(deckItems);
  }

  getDeckBackground(deckName: string): string {
    let backgroundImage: string;

    // if (deckName.includes('Charizard')) {
    //   backgroundImage = 'url("https://images.squarespace-cdn.com/content/v1/5cf4cfa4382ac0000123aa1b/b54fc451-b936-4668-b632-c3c090417702/Charizard+ex+OBF.png")';
    // } else if (deckName.includes('Arceus')) {
    //   backgroundImage = 'url("https://tcg.pokemon.com/assets/img/home/wallpapers/wallpaper-55.jpg?height=200")';
    // } else {
    // backgroundImage = 'url("https://assets-prd.ignimgs.com/2024/02/27/pokemon-card-back-1709069641229.png?height=300")';
    // }

    return `
      linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.6)),
      ${backgroundImage}
    `;
  }

  private handleError(error: ApiError): void {
    if (!error.handled) {
      this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
    }
  }
}
