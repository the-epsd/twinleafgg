import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Format, GameSettings, Archetype } from 'ptcg-server';
import { DeckListEntry } from 'src/app/api/interfaces/deck.interface';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { SelectPopupOption } from '../../shared/alert/select-popup/select-popup.component';
import { SessionService } from 'src/app/shared/session/session.service';
import { ArchetypeUtils } from '../../deck/deck-archetype-service/archetype.utils';
import { FormatValidator } from '../../util/formats-validator';


export interface CreateGamePopupData {
  decks: SelectPopupOption<DeckListEntry>[];
  invitedUserId?: number;
}

export interface CreateGamePopupResult {
  deckId: number;
  gameSettings: GameSettings;
}

@Component({
  selector: 'ptcg-create-game-popup',
  templateUrl: './create-game-popup.component.html',
  styleUrls: ['./create-game-popup.component.scss']
})
export class CreateGamePopupComponent implements OnInit {

  decks: SelectPopupOption<DeckListEntry>[];
  public deckId: number;
  public settings = new GameSettings();
  public isAdmin = false;
  public invitedUserId?: number;
  public isInvitingBot = false;
  public botFormat?: Format;
  public formatLocked = false;

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.STANDARD_MAJORS, label: 'LABEL_STANDARD_MAJORS' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.ETERNAL, label: 'LABEL_ETERNAL' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.THEME, label: 'FORMAT_THEME' },
    // { value: Format.PRE_RELEASE, label: 'LABEL_PRE_RELEASE' },
  ];

  public formatValidDecks: SelectPopupOption<number>[];
  public deckEntries: DeckListEntry[] = [];
  public formatDefaultDecks: { [format: string]: number } = {};
  public defaultDeckId: number | null = null;

  public timeLimits: SelectPopupOption<number>[] = [
    { value: 0, viewValue: 'GAMES_LIMIT_NO_LIMIT' },
    { value: 600, viewValue: 'GAMES_LIMIT_10_MIN' },
    { value: 900, viewValue: 'GAMES_LIMIT_15_MIN' },
    { value: 1200, viewValue: 'GAMES_LIMIT_20_MIN' },
    { value: 1500, viewValue: 'GAMES_LIMIT_25_MIN' },
    { value: 1800, viewValue: 'GAMES_LIMIT_30_MIN' },
  ];

  constructor(
    private dialogRef: MatDialogRef<CreateGamePopupComponent>,
    private cardsBaseService: CardsBaseService,
    @Inject(MAT_DIALOG_DATA) data: CreateGamePopupData,
    private sessionService: SessionService
  ) {
    this.decks = data.decks;
    this.invitedUserId = data.invitedUserId;
    this.settings.format = Format.STANDARD;
  }

  ngOnInit() {
    // Load default deck preferences
    this.loadDefaultDeckPreferences();

    // Initialize format selection first
    this.onFormatSelected(this.settings.format);

    // Check if we're inviting a bot and set format accordingly
    if (this.invitedUserId) {
      this.sessionService.get(session => {
        // invitedUserId is actually a clientId, so we need to find the client first
        const client = session.clients.find(c => c.clientId === this.invitedUserId);
        if (client) {
          const invitedUser = session.users[client.userId];
          if (invitedUser) {
            this.detectBotAndSetFormat(invitedUser.name);
          }
        }
        return client;
      }).subscribe();
    }

    // Check if user is admin (roleId === 4)
    this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    }).subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      // Set recording enabled based on admin status
      // If not admin, recording is always enabled
      // If admin, recording starts as disabled but can be toggled
      this.settings.recordingEnabled = !isAdmin;
    });
  }

  hasValidDeck(): boolean {
    const selectedDeck = this.decks.find(d => d.value.id === this.deckId);
    if (!selectedDeck) {
      return false;
    }
    // Check both format array and deck size
    if (!selectedDeck.value.format.includes(this.settings.format)) {
      return false;
    }
    // Use format-specific validation for deck size (60 cards required)
    return FormatValidator.isDeckValidForFormat(selectedDeck.value, this.settings.format);
  }


  public confirm() {
    // Check if the selected deck is valid for the chosen format
    const selectedDeck = this.decks.find(d => d.value.id === this.deckId);
    if (!selectedDeck) {
      // Show an error message or alert
      return;
    }
    // Check both format array and deck size
    // if (this.settings.format === Format.PRE_RELEASE) {
    //   if (!FormatValidator.isDeckValidForFormat(selectedDeck.value, this.settings.format)) {
    //     // Show an error message or alert
    //     return;
    //   }
    // } else {
    if (!selectedDeck.value.format.includes(this.settings.format)) {
      // Show an error message or alert
      return;
    }
    // Use format-specific validation for deck size (60 cards required)
    if (!FormatValidator.isDeckValidForFormat(selectedDeck.value, this.settings.format)) {
      // Show an error message or alert
      return;
    }
    // }

    this.dialogRef.close({
      deckId: this.deckId,
      gameSettings: this.settings
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

  onFormatSelected(format: Format) {
    this.deckEntries = this.decks.filter(d => {
      const deck = d.value;
      // Check both format array and deck size (60 cards required)
      // if (format === Format.PRE_RELEASE) {
      //   return FormatValidator.isDeckValidForFormat(deck, format);
      // }
      return deck.format.includes(format) && FormatValidator.isDeckValidForFormat(deck, format);
    }).map(d => d.value);

    this.formatValidDecks = this.deckEntries.map(d => ({ value: d.id, viewValue: d.name }));

    if (this.formatValidDecks.length > 0) {
      // Try to select the user's default deck for this format
      const defaultDeckId = this.getFormatDefaultDeckId(format);
      const defaultDeckExists = this.formatValidDecks.some(deck => deck.value === defaultDeckId);

      if (defaultDeckExists) {
        this.deckId = defaultDeckId;
      } else {
        // Fall back to first available deck
        this.deckId = this.formatValidDecks[0].value;
      }
    } else {
      this.deckId = null;
    }
  }

  public selectDeck(deckId: number) {
    this.deckId = deckId;
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

  private detectBotAndSetFormat(userName: string) {
    // Map bot names to their specific formats
    const botFormatMap: { [key: string]: Format } = {
      'Standard': Format.STANDARD,
      'Standard Nightly': Format.STANDARD_NIGHTLY,
      'Expanded': Format.EXPANDED,
      'GLC': Format.GLC,
      'Retro': Format.RETRO,
      'Theme': Format.THEME
    };

    if (botFormatMap[userName]) {
      this.isInvitingBot = true;
      this.botFormat = botFormatMap[userName];
      this.formatLocked = true;
      this.settings.format = this.botFormat;

      // Prevent scrolling during bot format change
      this.preventScrollDuringFormatChange();
    }
  }

  private preventScrollDuringFormatChange() {
    // Store current scroll position
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Call format selection
    this.onFormatSelected(this.settings.format);

    // Restore scroll position immediately and after a delay
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollTop);
    });

    setTimeout(() => {
      window.scrollTo(0, scrollTop);
    }, 10);
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
}
