import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ShowCardsPrompt, Card, GamePhase, ShowMulliganPrompt } from 'ptcg-server';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ptcg-prompt-show-mulligan',
  templateUrl: './prompt-show-mulligan.component.html',
  styleUrls: ['./prompt-show-mulligan.component.scss']
})
export class PromptShowMulliganComponent implements OnDestroy {

  @Input() prompt: ShowMulliganPrompt;
  @Input() gameState: LocalGameState;

  public isLoading = true;

  private isResolved = false;
  private timeoutId: any;
  private destroyed$ = new Subject<void>();

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
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