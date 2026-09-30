import { Component, Input, OnChanges } from '@angular/core';
import { ConfirmPrompt } from 'ptcg-server';

import { DeckService } from '../../../api/services/deck.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-confirm',
  templateUrl: './prompt-confirm.component.html',
  styleUrls: ['./prompt-confirm.component.scss']
})
export class PromptConfirmComponent implements OnChanges {

  private static deckNameCache = new Map<number, string>();

  @Input() prompt: ConfirmPrompt;
  @Input() gameState: LocalGameState;

  public goFirstDeckName = '';

  constructor(
    private gameService: GameService,
    private deckService: DeckService
  ) { }

  ngOnChanges() {
    this.loadGoFirstDeckName();
  }

  private loadGoFirstDeckName() {
    this.goFirstDeckName = '';
    if (!this.gameState?.state || !this.prompt) {
      return;
    }
    if (this.gameState.state.gameSettings?.selfPlay !== true) {
      return;
    }
    if (String(this.prompt.message) !== 'GO_FIRST') {
      return;
    }
    const deckId = this.gameState.state.players.find(p => p.id === this.prompt.playerId)?.deckId;
    if (deckId == null) {
      return;
    }
    const cached = PromptConfirmComponent.deckNameCache.get(deckId);
    if (cached) {
      this.goFirstDeckName = cached;
      return;
    }
    this.deckService.getDeck(deckId).subscribe({
      next: response => {
        const name = response.deck.name?.trim();
        if (!name) {
          return;
        }
        PromptConfirmComponent.deckNameCache.set(deckId, name);
        if (this.prompt && String(this.prompt.message) === 'GO_FIRST') {
          this.goFirstDeckName = name;
        }
      },
      error: () => { }
    });
  }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    this.gameService.resolvePrompt(gameId, id, false);
  }

}
