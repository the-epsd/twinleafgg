import { Component, Input } from '@angular/core';
import { ShowCardsPrompt, Card, GamePhase } from 'ptcg-server';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-confirm-cards',
  templateUrl: './prompt-confirm-cards.component.html',
  styleUrls: ['./prompt-confirm-cards.component.scss']
})
export class PromptConfirmCardsComponent {

  @Input() prompt: ShowCardsPrompt;
  @Input() gameState: LocalGameState;

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

  // ngOnInit() {
  //   const gameId = this.gameState.gameId;
  //   const id = this.prompt.id;

  //   if (GamePhase.SETUP || GamePhase.WAITING_FOR_PLAYERS) {
  //   setTimeout(() => {
  //     this.gameService.resolvePrompt(gameId, id, null);
  //   }, 3000);
  //   } else {
  //     setTimeout(() => {
  //       this.gameService.resolvePrompt(gameId, id, null);
  //     }, 5000);
  // }
  // }

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
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public onCardClick(card: Card) {
    this.cardsBaseService.showCardInfo({ card });
  }

}
