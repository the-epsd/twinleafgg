import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card, Format, GameSettings } from 'ptcg-server';
import { Deck, DeckListEntry } from 'src/app/api/interfaces/deck.interface';
import { CardsBaseService } from 'src/app/shared/cards/cards-base.service';
import { FormatValidator } from 'src/app/util/formats-validator';
import { SelectPopupOption } from '../../shared/alert/select-popup/select-popup.component';

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
export class CreateGamePopupComponent {

  decks: SelectPopupOption<DeckListEntry>[];
  public deckId: number;
  public settings = new GameSettings();

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'Standard Nightly' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
  ];

  public formatValidDecks: SelectPopupOption<number>[];

  public timeLimits: SelectPopupOption<number>[] = [
    { value: 0, viewValue: 'GAMES_LIMIT_NO_LIMIT' },
    { value: 600, viewValue: 'GAMES_LIMIT_10_MIN' },
    { value: 900, viewValue: 'GAMES_LIMIT_15_MIN' },
  ];

  constructor(
    private dialogRef: MatDialogRef<CreateGamePopupComponent>,
    private cardsBaseService: CardsBaseService,
    @Inject(MAT_DIALOG_DATA) data: CreateGamePopupData,
  ) {
    this.decks = data.decks;
    this.settings.format = Format.STANDARD;

    data.decks.forEach(deck => {
      const deckCards: Card[] = [];
      deck.value.cards.forEach(card => deckCards.push(this.cardsBaseService.getCardByName(card)));
      deck.value.format = FormatValidator.getValidFormatsForCardList(deckCards);
    });

    this.onFormatSelected(this.settings.format);
  }

  hasValidDeck(): boolean {
    const selectedDeck = this.decks.find(d => d.value.id === this.deckId);
    return selectedDeck && selectedDeck.value.format.includes(this.settings.format);
  }


  public confirm() {
    // Check if the selected deck is valid for the chosen format
    const selectedDeck = this.decks.find(d => d.value.id === this.deckId);
    if (selectedDeck && !selectedDeck.value.format.includes(this.settings.format)) {
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
      d.value.format.includes(format)
    ).map(d => ({ value: d.value.id, viewValue: d.value.name }));

    if (this.formatValidDecks.length > 0) {
      this.deckId = this.formatValidDecks[0].value;
    }
  }
}
