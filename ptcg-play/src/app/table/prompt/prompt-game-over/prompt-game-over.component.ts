import { Component, Input } from '@angular/core';
import { GameWinner } from 'ptcg-server';

import { GameOverPrompt } from './game-over.prompt';
import { LocalGameState } from '../../../shared/session/session.interface';
import { SessionService } from '../../../shared/session/session.service';
import { GameService } from '../../../api/services/game.service';

@Component({
  selector: 'ptcg-prompt-game-over',
  templateUrl: './prompt-game-over.component.html',
  styleUrls: ['./prompt-game-over.component.scss']
})
export class PromptGameOverComponent {

  @Input() prompt: GameOverPrompt;
  @Input() gameState: LocalGameState;

  public GameWinner = GameWinner;

  constructor(
    private sessionService: SessionService,
    private gameService: GameService
  ) { }

  public confirm() {
    // Remove the game state completely when user confirms game over
    this.gameService.removeGameState(this.gameState.gameId);
    this.gameService.removeLocalGameState(this.gameState.localId);
  }

}
