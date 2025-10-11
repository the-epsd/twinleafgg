import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Format, InvitePlayerPrompt, Archetype } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../../api/api.error';
import { AlertService } from '../../../shared/alert/alert.service';
import { DeckService } from 'src/app/api/services/deck.service';
import { GameService } from '../../../api/services/game.service';
import { SelectPopupOption } from '../../../shared/alert/select-popup/select-popup.component';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { ArchetypeUtils } from '../../../deck/deck-archetype-service/archetype.utils';
import { DeckListEntry } from '../../../api/interfaces/deck.interface';

@UntilDestroy()
@Component({
  selector: 'ptcg-prompt-invite-player',
  templateUrl: './prompt-invite-player.component.html',
  styleUrls: ['./prompt-invite-player.component.scss']
})
export class PromptInvitePlayerComponent implements OnInit {

  @Input() prompt: InvitePlayerPrompt;
  @Input() gameState: LocalGameState;

  public formats = {
    [Format.STANDARD]: 'LABEL_STANDARD',
    [Format.GLC]: 'LABEL_GLC',
    [Format.UNLIMITED]: 'LABEL_UNLIMITED',
    [Format.EXPANDED]: 'LABEL_EXPANDED',
    [Format.SWSH]: 'LABEL_SWSH',
    [Format.SM]: 'LABEL_SM',
    [Format.XY]: 'LABEL_XY',
    [Format.BW]: 'LABEL_BW',
    [Format.RSPK]: 'LABEL_RSPK',
    [Format.RETRO]: 'LABEL_RETRO',
    [Format.THEME]: 'FORMAT_THEME',
  };

  public loading = true;
  public decks: SelectPopupOption<number>[] = [];
  public deckEntries: DeckListEntry[] = [];
  public deckId: number;
  public selectedDeckName: string = '';
  public isConfirming = false;
  public formatDefaultDecks: { [format: string]: number } = {};
  public defaultDeckId: number | null = null;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private gameService: GameService,
    private cardsBaseService: CardsBaseService,
    private router: Router
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public confirm() {
    if (!this.deckId || this.isConfirming) {
      return;
    }

    const gameId = this.gameState.gameId;
    const id = this.prompt.id;

    this.isConfirming = true;
    this.loading = true;
    this.deckService.getDeck(this.deckId)
      .pipe(finalize(() => {
        this.loading = false;
        this.isConfirming = false;
      }))
      .subscribe({
        next: deckResponse => {
          const deck = deckResponse.deck.cards;
          this.gameService.resolvePrompt(gameId, id, deck);
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
        }
      });
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public selectDeck(deckId: number) {
    this.deckId = deckId;
    const selectedDeck = this.decks.find(deck => deck.value === deckId);
    this.selectedDeckName = selectedDeck ? selectedDeck.viewValue : '';
  }

  public getDeckArchetype(deckId: number): Archetype | Archetype[] {
    const deckEntry = this.deckEntries.find(deck => deck.id === deckId);
    if (!deckEntry) return Archetype.UNOWN;

    // If manual archetypes are set, use those
    if (deckEntry.manualArchetype1 || deckEntry.manualArchetype2) {
      const archetypes = [];
      if (deckEntry.manualArchetype1) archetypes.push(deckEntry.manualArchetype1);
      if (deckEntry.manualArchetype2) archetypes.push(deckEntry.manualArchetype2);
      return archetypes.length > 0 ? archetypes : Archetype.UNOWN;
    }

    // Otherwise use auto-detection
    return ArchetypeUtils.getArchetype(deckEntry.deckItems, false);
  }

  private loadDecks() {
    this.loading = true;
    this.deckService.getListByFormat(this.gameState.format)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
      ).
      subscribe({
        next: decks => {
          this.deckEntries = decks.filter(deckEntry => deckEntry.isValid);
          this.decks = this.deckEntries.map(deckEntry => ({ value: deckEntry.id, viewValue: deckEntry.name }));

          if (this.decks.length > 0) {
            // Try to select the user's default deck for this format
            const defaultDeckId = this.getFormatDefaultDeckId(this.gameState.format);
            const defaultDeckExists = this.decks.some(deck => deck.value === defaultDeckId);

            if (defaultDeckExists) {
              this.deckId = defaultDeckId;
              const selectedDeck = this.decks.find(deck => deck.value === defaultDeckId);
              this.selectedDeckName = selectedDeck ? selectedDeck.viewValue : '';
            } else {
              // Fall back to first available deck
              this.deckId = this.decks[0].value;
              this.selectedDeckName = this.decks[0].viewValue;
            }
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
          this.decks = [];
        }
      });
  }

  ngOnInit() {
    // Load default deck preferences
    this.loadDefaultDeckPreferences();
    this.loadDecks();
  }

  private loadDefaultDeckPreferences() {
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
  }

  private getFormatDefaultDeckId(format: Format): number | null {
    // Map Format enum to string keys used in localStorage
    const formatKeyMap: { [key: number]: string } = {
      [Format.STANDARD]: 'standard',
      [Format.STANDARD_NIGHTLY]: 'standard_nightly',
      [Format.GLC]: 'glc',
      [Format.EXPANDED]: 'expanded',
      [Format.UNLIMITED]: 'unlimited',
      [Format.SWSH]: 'swsh',
      [Format.SM]: 'sm',
      [Format.XY]: 'xy',
      [Format.BW]: 'bw',
      [Format.RSPK]: 'rspk',
      [Format.RETRO]: 'retro',
      [Format.THEME]: 'theme'
    };

    const formatKey = formatKeyMap[format];
    if (formatKey && this.formatDefaultDecks[formatKey]) {
      return this.formatDefaultDecks[formatKey];
    }
    return this.defaultDeckId;
  }

  navigateToDeck(): void {
    this.router.navigate(['/deck']);
  }

}
