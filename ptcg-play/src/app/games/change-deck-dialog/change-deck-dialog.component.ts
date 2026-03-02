import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Format, Archetype } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../api/api.error';
import { DeckService } from '../../api/services/deck.service';
import { DeckListEntry } from '../../api/interfaces/deck.interface';
import { CardsBaseService } from '../../shared/cards/cards-base.service';
import { ArchetypeUtils } from '../../deck/deck-archetype-service/archetype.utils';
import { FormatValidator } from '../../util/formats-validator';
import { AlertService } from '../../shared/alert/alert.service';
import { DeckItem } from '../../deck/deck-card/deck-card.interface';

export interface ChangeDeckDialogData {
  format: Format;
}

@Component({
  selector: 'ptcg-change-deck-dialog',
  templateUrl: './change-deck-dialog.component.html',
  styleUrls: ['./change-deck-dialog.component.scss']
})
@UntilDestroy()
export class ChangeDeckDialogComponent implements OnInit {

  public loading = true;
  public decks: { value: number; viewValue: string }[] = [];
  public deckEntries: DeckListEntry[] = [];
  public deckId: number | null = null;
  public formatDefaultDecks: { [format: string]: number } = {};
  public defaultDeckId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<ChangeDeckDialogComponent>,
    private deckService: DeckService,
    private cardsBaseService: CardsBaseService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: ChangeDeckDialogData
  ) { }

  ngOnInit(): void {
    this.loadDefaultDeckPreferences();
    this.loadDecks();
  }

  public cancel(): void {
    this.dialogRef.close();
  }

  public confirm(): void {
    if (!this.deckId) return;
    this.dialogRef.close(this.deckId);
  }

  public selectDeck(deckId: number): void {
    this.deckId = deckId;
  }

  public getDeckArchetype(deckId: number): Archetype | Archetype[] {
    const deckEntry = this.deckEntries.find(deck => deck.id === deckId);
    if (!deckEntry) return Archetype.UNOWN;

    if (deckEntry.manualArchetype1 || deckEntry.manualArchetype2) {
      const archetypes = [];
      if (deckEntry.manualArchetype1) archetypes.push(deckEntry.manualArchetype1);
      if (deckEntry.manualArchetype2) archetypes.push(deckEntry.manualArchetype2);
      return archetypes.length > 0 ? archetypes : Archetype.UNOWN;
    }

    return ArchetypeUtils.getArchetype(deckEntry.deckItems, false);
  }

  private loadDefaultDeckPreferences(): void {
    const savedDefaultDeckId = localStorage.getItem('defaultDeckId');
    if (savedDefaultDeckId) {
      this.defaultDeckId = parseInt(savedDefaultDeckId, 10);
    }

    const savedFormatDefaults = localStorage.getItem('formatDefaultDecks');
    if (savedFormatDefaults) {
      this.formatDefaultDecks = JSON.parse(savedFormatDefaults);
    }
  }

  private getFormatDefaultDeckId(format: Format): number | null {
    const formatKey = Format[format]?.toLowerCase();
    if (formatKey && this.formatDefaultDecks[formatKey]) {
      return this.formatDefaultDecks[formatKey];
    }
    return this.defaultDeckId;
  }

  private loadDecks(): void {
    this.loading = true;
    this.deckService.getListByFormat(this.data.format, { summary: true })
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
      )
      .subscribe({
        next: decks => {
          const filtered = decks.filter(deckEntry =>
            deckEntry.format.includes(this.data.format) &&
            FormatValidator.isDeckValidForFormat(deckEntry, this.data.format)
          );
          if (decks.some(d => d.cards)) {
            filtered.forEach(deck => {
              if (deck.cards) {
                const deckCards: DeckItem[] = [];
                deck.cards.forEach(card => {
                  const cardObj = this.cardsBaseService.getCardByName(card);
                  if (cardObj) {
                    deckCards.push({
                      card: cardObj,
                      count: 0,
                      pane: null,
                      scanUrl: null
                    });
                  }
                });
                deck.deckItems = deckCards;
              }
            });
          }
          this.deckEntries = filtered;
          this.decks = this.deckEntries.map(deckEntry => ({
            value: deckEntry.id,
            viewValue: deckEntry.name
          }));

          if (this.decks.length > 0) {
            const defaultDeckId = this.getFormatDefaultDeckId(this.data.format);
            const defaultDeckExists = this.decks.some(deck => deck.value === defaultDeckId);

            if (defaultDeckExists) {
              this.deckId = defaultDeckId;
            } else {
              this.deckId = this.decks[0].value;
            }
          } else {
            this.deckId = null;
          }
        },
        error: (error: ApiError) => {
          this.alertService.toast(error.message);
          this.decks = [];
        }
      });
  }
}
