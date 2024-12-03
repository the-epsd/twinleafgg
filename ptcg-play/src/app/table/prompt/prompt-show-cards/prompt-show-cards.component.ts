import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ShowCardsPrompt, Card, GamePhase } from 'ptcg-server';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-show-cards',
  templateUrl: './prompt-show-cards.component.html',
  styleUrls: ['./prompt-show-cards.component.scss']
})
export class PromptShowCardsComponent implements OnInit, OnDestroy {

  @Input() prompt: ShowCardsPrompt;
  @Input() gameState: LocalGameState;

  public isLoading = true;

  private isResolved = false;
  private timeoutId: any;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.timeoutId = setTimeout(() => {
      this.resolvePrompt();
    }, 3000);
  }

  ngOnDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  private resolvePrompt() {
    if (!this.isResolved) {
      this.isResolved = true;
      const gameId = this.gameState.gameId;
      const id = this.prompt.id;
      this.gameService.resolvePrompt(gameId, id, null);
    }
  }

  public confirm() {
    this.resolvePrompt();
  }

  public cancel() {
    this.resolvePrompt();
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    // this.gameService.resolvePrompt(gameId, id, null);
  }

  public onCardClick(card: Card) {
    this.cardsBaseService.showCardInfo({ card });
  }
}
