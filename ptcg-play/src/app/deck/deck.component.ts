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
import { Archetype } from 'ptcg-server';
import { ArchetypeUtils } from './deck-archetype-service/archetype.utils';
import { Format } from 'ptcg-server';
import { SettingsService } from '../table/table-sidebar/settings-dialog/settings.service';

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
  public formatDefaultDecks: { [key: string]: number } = {};
  public selectedFormat: string = 'all';
  public filteredDecks: DeckListEntry[] = [];
  public showThemeDecksInAllTab = false;
  public hiddenFormats: Format[] = [];
  public hoveredDeckId: number | null = null;

  // Map Format enum values to their string keys for display
  public formatNameMap: { [key: number]: string } = {
    [Format.STANDARD]: 'standard',
    [Format.STANDARD_NIGHTLY]: 'standard_nightly',
    [Format.STANDARD_MAJORS]: 'standard_majors',
    [Format.EXPANDED]: 'expanded',
    [Format.UNLIMITED]: 'unlimited',
    [Format.ETERNAL]: 'eternal',
    [Format.RSPK]: 'RSPK',
    [Format.RETRO]: 'retro',
    [Format.GLC]: 'glc',
    [Format.THEME]: 'theme',
    [Format.SWSH]: 'swsh',
    [Format.SM]: 'sm',
    [Format.XY]: 'xy',
    [Format.BW]: 'bw',
  };

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private cardsBaseService: CardsBaseService,
    private translate: TranslateService,
    private router: Router,
    private settingsService: SettingsService,
  ) { }

  public ngOnInit() {
    this.refreshList();
    this.selectFormat('all');

    // Load global default deck
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      this.defaultDeckId = parseInt(savedDefaultDeckId, 10);
    }

    // Load format-specific default decks
    const savedFormatDefaults = localStorage.getItem('formatDefaultDecks');
    if (savedFormatDefaults) {
      this.formatDefaultDecks = JSON.parse(savedFormatDefaults);
    }

    // Load show theme decks toggle preference
    const savedShowThemeDecks = localStorage.getItem('showThemeDecksInAllTab');
    if (savedShowThemeDecks !== null) {
      this.showThemeDecksInAllTab = JSON.parse(savedShowThemeDecks);
    }

    // Subscribe to hidden formats setting
    this.settingsService.hiddenFormats$.pipe(
      untilDestroyed(this)
    ).subscribe(hiddenFormats => {
      this.hiddenFormats = hiddenFormats;
    });
  }

  // Set default deck for all formats
  public async setAsDefault(deckId: number) {
    this.defaultDeckId = deckId;
    localStorage.setItem('defaultDeckId', deckId.toString());
    this.alertService.toast(this.translate.instant('DECK_SET_AS_DEFAULT'));
  }

  // Set default deck for a specific format
  public async setAsFormatDefault(deckId: number, format: string) {
    this.formatDefaultDecks[format] = deckId;
    localStorage.setItem('formatDefaultDecks', JSON.stringify(this.formatDefaultDecks));
    this.alertService.toast(this.translate.instant('DECK_SET_AS_FORMAT_DEFAULT', { format: this.getFormatDisplayName(format) }));
  }

  // Get the default deck for the current format
  public getFormatDefaultDeckId(format: string): number | null {
    if (format === 'all' || !this.formatDefaultDecks[format]) {
      return this.defaultDeckId;
    }
    return this.formatDefaultDecks[format];
  }

  // Check if a deck is the default for the current format
  public isFormatDefaultDeck(deckId: number): boolean {
    if (this.selectedFormat === 'all') {
      return this.defaultDeckId === deckId;
    }

    const formatDefaultId = this.formatDefaultDecks[this.selectedFormat];
    return formatDefaultId === deckId;
  }

  private refreshList() {
    this.loading = true;
    this.deckService.getList({ summary: true, limit: 100, offset: 0 }).pipe(
      finalize(() => {
        this.loading = false;
        // Update filtered decks based on current format
        this.selectFormat(this.selectedFormat);
      }),
      untilDestroyed(this)
    )
      .subscribe(response => {
        this.decks = response.decks;

        // Only build deckItems when full card data is present (non-summary response)
        if (response.decks.some(d => d.cards)) {
          this.decks.forEach(deck => {
            if (deck.cards) {
              const deckCards: DeckItem[] = [];
              deck.cards.forEach(card => {
                deckCards.push({
                  card: this.cardsBaseService.getCardByName(card)!,
                  count: 0,
                  pane: null,
                  scanUrl: null
                });
              });
              deck.deckItems = deckCards;
            }
          });
        }
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

  public async createDeckFromClipboard() {
    // Read clipboard first while user gesture is still active (before any async work)
    let clipboardText: string;
    try {
      clipboardText = await navigator.clipboard.readText();
    } catch (e) {
      console.error('[Deck] Clipboard read failed', e);
      this.alertService.toast(this.translate.instant('ERROR_CLIPBOARD_ACCESS'));
      return;
    }

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
        // Pass clipboard text via router state - deck editor will import and save
        this.router.navigate(['/deck', response.deck.id], { state: { importFromClipboard: clipboardText } });
        this.refreshList();
      },
      (error: ApiError) => {
        console.error('[Deck] createDeckFromClipboard failed', error);
        this.handleError(error);
      }
    );
  }

  public exportDeckList(deck: DeckListEntry): void {
    if (deck.deckItems && deck.deckItems.length > 0) {
      const deckList = this.generateDeckList(deck);
      navigator.clipboard.writeText(deckList).then(() => {
        this.alertService.toast(this.translate.instant('DECK_EXPORTED_TO_CLIPBOARD'));
      });
      return;
    }
    // Lazy load full deck when deckItems not available (summary mode)
    this.deckService.getDeck(deck.id).pipe(untilDestroyed(this)).subscribe(
      response => {
        const deckCards: DeckItem[] = [];
        response.deck.cards.forEach(card => {
          const c = this.cardsBaseService.getCardByName(card);
          if (c) {
            deckCards.push({ card: c, count: 0, pane: null, scanUrl: null });
          }
        });
        const deckList = this.generateDeckListFromCards(deckCards);
        navigator.clipboard.writeText(deckList).then(() => {
          this.alertService.toast(this.translate.instant('DECK_EXPORTED_TO_CLIPBOARD'));
        });
      },
      (error: ApiError) => this.handleError(error)
    );
  }

  private generateDeckList(deck: DeckListEntry): string {
    if (!deck.deckItems) return '';
    return this.generateDeckListFromCards(deck.deckItems);
  }

  private generateDeckListFromCards(deckItems: DeckItem[]): string {
    const cardCounts = new Map<string, number>();
    deckItems.forEach(item => {
      if (item.card) {
        const cardName = `${item.card.name} ${item.card.set} ${item.card.setNumber}`;
        cardCounts.set(cardName, (cardCounts.get(cardName) || 0) + 1);
      }
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

  getArchetype(deck: DeckListEntry, returnSingle: boolean = false): Archetype | Archetype[] {
    if (!deck) return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];

    // If manual archetypes are set, use those
    if (deck.manualArchetype1 || deck.manualArchetype2) {
      const archetypes = [];
      if (deck.manualArchetype1) archetypes.push(deck.manualArchetype1);
      if (deck.manualArchetype2) archetypes.push(deck.manualArchetype2);
      return returnSingle ? archetypes[0] : archetypes;
    }

    // Otherwise use auto-detection (requires deckItems - in summary mode we show placeholder)
    if (!deck.deckItems || deck.deckItems.length === 0) {
      return returnSingle ? Archetype.UNOWN : [Archetype.UNOWN];
    }
    return ArchetypeUtils.getArchetype(deck.deckItems, returnSingle);
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

  public selectFormat(format: string) {
    this.selectedFormat = format;

    if (format === 'theme') {
      // Show only theme decks
      this.filteredDecks = this.decks.filter(deck => Array.isArray(deck.format) && deck.format.includes(Format['THEME']));
    } else if (format === 'all') {
      // Show all user decks, plus theme decks if toggle is on
      if (this.showThemeDecksInAllTab) {
        this.filteredDecks = this.decks;
      } else {
        this.filteredDecks = this.decks.filter(deck => !Array.isArray(deck.format) || !deck.format.includes(Format['THEME']));
      }
    } else {
      // For other formats, show only decks valid for that format
      this.filteredDecks = this.decks.filter(deck =>
        Array.isArray(deck.format) && deck.format.includes(Format[format.toUpperCase()])
      );
    }
  }

  public onShowThemeDecksToggleChange() {
    // Save the toggle state to local storage
    localStorage.setItem('showThemeDecksInAllTab', JSON.stringify(this.showThemeDecksInAllTab));
    // Refresh the current format to apply the change
    this.selectFormat(this.selectedFormat);
  }

  public getFormatDisplayName(format: string): string {
    const formatDisplayNames = {
      'standard': this.translate.instant('FORMAT_STANDARD'),
      'standard_nightly': this.translate.instant('FORMAT_STANDARD_NIGHTLY'),
      'standard_majors': this.translate.instant('FORMAT_STANDARD_MAJORS'),
      'expanded': this.translate.instant('FORMAT_EXPANDED'),
      'unlimited': this.translate.instant('FORMAT_UNLIMITED'),
      'eternal': this.translate.instant('FORMAT_ETERNAL'),
      'RSPK': this.translate.instant('FORMAT_RSPK'),
      'retro': this.translate.instant('FORMAT_RETRO'),
      'glc': this.translate.instant('FORMAT_GLC'),
      'theme': this.translate.instant('FORMAT_THEME'),
      'swsh': this.translate.instant('FORMAT_SWSH'),
      'sm': this.translate.instant('FORMAT_SM'),
      'xy': this.translate.instant('FORMAT_XY'),
      'bw': this.translate.instant('FORMAT_BW'),
    };
    return formatDisplayNames[format] || format;
  }

  // Check if a format should be hidden based on settings
  public isFormatHidden(format: string): boolean {
    // Map format string to Format enum value
    const formatEnumMap: { [key: string]: Format } = {
      'standard': Format.STANDARD,
      'standard_nightly': Format.STANDARD_NIGHTLY,
      'standard_majors': Format.STANDARD_MAJORS,
      'glc': Format.GLC,
      'expanded': Format.EXPANDED,
      'unlimited': Format.UNLIMITED,
      'eternal': Format.ETERNAL,
      'RSPK': Format.RSPK,
      'retro': Format.RETRO,
      'theme': Format.THEME,
      'swsh': Format.SWSH,
      'sm': Format.SM,
      'xy': Format.XY,
      'bw': Format.BW,
    };

    const formatEnum = formatEnumMap[format];
    if (formatEnum === undefined) {
      return false; // Don't hide 'all' or unknown formats
    }

    return this.hiddenFormats.includes(formatEnum);
  }

  // Check if any formats in the "More Formats" dropdown are visible
  public hasVisibleMoreFormats(): boolean {
    const moreFormats = ['theme', 'swsh', 'sm', 'xy', 'bw'];
    return moreFormats.some(format => !this.isFormatHidden(format));
  }

  public navigateToDeckStats(deckId: number) {
    this.router.navigate(['/deck', deckId, 'stats']);
  }
}
