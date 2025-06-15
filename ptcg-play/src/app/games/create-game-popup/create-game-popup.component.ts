import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Format, GameSettings } from 'ptcg-server';
import { DeckListEntry } from 'src/app/api/interfaces/deck.interface';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { SelectPopupOption } from '../../shared/alert/select-popup/select-popup.component';
import { SessionService } from 'src/app/shared/session/session.service';


export interface CreateGamePopupData {
  decks: SelectPopupOption<DeckListEntry>[];
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

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.THEME, label: 'FORMAT_THEME' },
  ];

  public formatValidDecks: SelectPopupOption<number>[];

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
    this.settings.format = Format.STANDARD;

    this.onFormatSelected(this.settings.format);
  }

  ngOnInit() {
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
    return selectedDeck && selectedDeck.value.format.includes(this.settings.format) && selectedDeck.value.isValid;
  }


  public confirm() {
    // Check if the selected deck is valid for the chosen format
    const selectedDeck = this.decks.find(d => d.value.id === this.deckId);
    if (!selectedDeck || !selectedDeck.value.format.includes(this.settings.format) || !selectedDeck.value.isValid) {
      // Show an error message or alert
      console.error('Selected deck is not valid for the chosen format.');
      return;
    }

    this.dialogRef.close({
      deckId: this.deckId,
      gameSettings: this.settings
    });
  }

  public cancel() {
    this.dialogRef.close();
  }

  onFormatSelected(format: Format) {
    this.formatValidDecks = this.decks.filter(d =>
      d.value.format.includes(format) && d.value.isValid
    ).map(d => ({ value: d.value.id, viewValue: d.value.name }));

    if (this.formatValidDecks.length > 0) {
      this.deckId = this.formatValidDecks[0].value;
    } else {
      this.deckId = null;
    }
  }
}
