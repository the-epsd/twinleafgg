import { Component, OnInit, Input } from '@angular/core';
import { Format, InvitePlayerPrompt } from 'ptcg-server';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { ApiError } from '../../../api/api.error';
import { AlertService } from '../../../shared/alert/alert.service';
import { DeckService } from 'src/app/api/services/deck.service';
import { GameService } from '../../../api/services/game.service';
import { SelectPopupOption } from '../../../shared/alert/select-popup/select-popup.component';
import { LocalGameState } from '../../../shared/session/session.interface';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

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
  public deckId: number;

  constructor(
    private alertService: AlertService,
    private deckService: DeckService,
    private gameService: GameService,
    private cardsBaseService: CardsBaseService
  ) { }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;

    this.loading = true;
    this.deckService.getDeck(this.deckId)
      .pipe(finalize(() => { this.loading = false; }))
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

  private loadDecks() {
    console.log('[InvitePlayer] gameState.format:', this.gameState.format);
    this.loading = true;
    this.deckService.getListByFormat(this.gameState.format)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this),
      ).
      subscribe({
        next: decks => {
          console.log('[InvitePlayer] Raw response from deckService.getListByFormat:', decks);
          console.log('[InvitePlayer] Decks received from backend:', decks);
          this.decks = decks
            .filter(deckEntry => deckEntry.isValid)
            .map(deckEntry => ({ value: deckEntry.id, viewValue: deckEntry.name }));
          console.log('[InvitePlayer] Final decks shown to user:', this.decks);
          if (this.decks.length > 0) {
            this.deckId = this.decks[0].value;
            console.log('[InvitePlayer] Default selected deckId:', this.deckId);
          }
        },
        error: (error: ApiError) => {
          console.error('[InvitePlayer] Error loading decks:', error);
          this.alertService.toast(error.message);
          this.decks = [];
        }
      });
  }

  ngOnInit() {
    this.loadDecks();
  }

}
