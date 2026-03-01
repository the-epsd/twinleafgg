import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { GameWinner } from 'ptcg-server';
import { LocalGameState } from '../../shared/session/session.interface';
import { GameOverPrompt } from '../prompt/prompt-game-over/game-over.prompt';
import { SessionService } from '../../shared/session/session.service';

@Component({
  selector: 'ptcg-match-results-splash',
  templateUrl: './match-results-splash.component.html',
  styleUrls: ['./match-results-splash.component.scss'],
  animations: [
    trigger('splashFade', [
      transition(':leave', [
        animate('400ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class MatchResultsSplashComponent implements OnInit {
  @Input() prompt!: GameOverPrompt;
  @Input() gameState!: LocalGameState;
  @Output() dismiss = new EventEmitter<void>();

  public GameWinner = GameWinner;
  public displayText = 'VICTORY';
  public isWinner = false;
  public resultClass = 'victory';

  private dismissTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.updateDisplayState();

    this.dismissTimeout = setTimeout(() => {
      this.emitDismiss();
    }, 2500);
  }

  private updateDisplayState(): void {
    if (!this.gameState?.state || !this.prompt) {
      return;
    }

    const state = this.gameState.state;
    const currentPlayerId = this.sessionService.session.clientId;

    if (this.prompt.winner === GameWinner.DRAW) {
      this.displayText = 'DRAW';
      this.resultClass = 'draw';
      this.isWinner = false;
    } else {
      const isPlayerA = this.prompt.winner === GameWinner.PLAYER_1 ||
        (this.prompt.winner as unknown) === 'PLAYER_A';
      const winningPlayerId = isPlayerA ? state.players[0].id : state.players[1].id;
      this.isWinner = String(currentPlayerId) === String(winningPlayerId);

      if (this.isWinner) {
        this.displayText = 'VICTORY';
        this.resultClass = 'victory';
      } else {
        this.displayText = 'DEFEAT';
        this.resultClass = 'defeat';
      }
    }
  }

  onSplashClick(): void {
    if (this.dismissTimeout) {
      clearTimeout(this.dismissTimeout);
      this.dismissTimeout = null;
    }
    this.emitDismiss();
  }

  private emitDismiss(): void {
    this.dismiss.emit();
  }
}
