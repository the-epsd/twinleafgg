import { AnimationEvent } from '@angular/animations';
import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Prompt, GamePhase } from 'ptcg-server';

import { GameService } from '../../api/services/game.service';
import { GameOverPrompt } from './prompt-game-over/game-over.prompt';
import { LocalGameState } from '../../shared/session/session.interface';
import { ptcgPromptAnimations } from './prompt.animations';

@Component({
  selector: 'ptcg-prompt',
  templateUrl: './prompt.component.html',
  styleUrls: ['./prompt.component.scss'],
  animations: [ptcgPromptAnimations.promptContent],
  encapsulation: ViewEncapsulation.None
})
export class PromptComponent implements OnChanges {

  @Input() gameState: LocalGameState;
  @Input() clientId: number;

  public isPromptVisible = false;

  /** State of the dialog animation. */
  public animationState: 'void' | 'enter' | 'exit' | 'minimize' | 'confirm' = 'void';

  public prompt: Prompt<any>;

  public minimized = false;

  // Store the prompt action to be executed after animation completes
  // private pendingPromptAction: { gameId: number, promptId: number, result: any } | null = null;

  constructor(private gameService: GameService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.gameState || !this.clientId) {
      return this.toggle(false);
    }

    let differentGame = false;
    if (changes.gameState) {
      const previousState: LocalGameState = changes.gameState.previousValue;
      differentGame = !previousState || previousState.localId !== this.gameState.localId;
    }

    // In replay mode, we need special handling
    if (this.gameState.replay) {
      // If we're navigating through replay states (position changes), hide any active prompts
      if (changes.gameState && changes.gameState.previousValue &&
        changes.gameState.previousValue.replayPosition !== this.gameState.replayPosition) {
        this.prompt = undefined;
        this.toggle(false);
        return;
      }
    }

    let prompt = this.gameState.state.prompts.find(p => {
      return p.playerId === this.clientId && p.result === undefined;
    });

    prompt = prompt || this.checkGameOver(this.gameState);
    const promptId = prompt ? prompt.id : -1;
    const currentId = this.prompt ? this.prompt.id : -1;

    if (currentId !== promptId || differentGame) {
      this.prompt = undefined;
      // setTimeout, because we would like the new prompt animate before displaying
      window.setTimeout(() => {
        this.prompt = prompt;
        this.minimized = false;
        this.maximize();
        this.toggle(prompt !== undefined);
      });
    } else if (this.minimized !== this.gameState.promptMinimized) {
      this.minimized = this.gameState.promptMinimized;
      this.toggle(prompt !== undefined && !this.minimized);
    }
  }

  public minimize() {
    // Start minimize animation before actually setting minimized state
    this.animationState = 'minimize';
    // Since animation is now immediate, set minimized state right away
    this.gameService.setPromptMinimized(this.gameState.localId, true);
    // No need for animation on the minimize button
  }

  public maximize() {
    if (this.gameState.promptMinimized) {
      // Update the game state
      this.gameService.setPromptMinimized(this.gameState.localId, false);

      // Make the prompt visible again
      this.isPromptVisible = true;

      // Trigger animation from minimize to enter
      this.animationState = 'enter';
    }
  }

  /**
   * Play confirm animation before resolving prompt
   */
  public animateAndResolvePrompt(gameId: number, promptId: number, result: any) {
    // Since animation is now immediate, resolve prompt right away
    this.gameService.resolvePrompt(gameId, promptId, result);
    // Set animation state last to ensure proper onAnimationEnd behavior
    this.animationState = 'confirm';
  }

  /** Callback, invoked whenever an animation on the host completes. */
  public onAnimationEnd(event: AnimationEvent) {
    // If exiting or void state and prompt is gone/minimized, hide the prompt
    const toExitState = event.toState === 'exit' || event.toState === 'void' ||
      event.toState === 'minimize' || event.toState === 'confirm';
    const isNotVisible = this.prompt === undefined || this.minimized;

    if (toExitState && isNotVisible) {
      this.isPromptVisible = false;
    }
  }

  /** Starts the dialog enter/exit animation. */
  private toggle(value: boolean): void {
    if (this.animationState !== 'enter' && value === true) {
      this.isPromptVisible = true;
      this.animationState = 'enter';
    } else if (this.animationState !== 'exit' && value === false) {
      // If already minimized, don't animate exit again
      if (this.minimized) {
        this.isPromptVisible = false;
      } else {
        this.animationState = 'exit';
      }
    }
  }

  private checkGameOver(gameState: LocalGameState): GameOverPrompt | undefined {
    // Return undefined to prevent the old game over prompt from appearing
    // The new game over screen is now handled directly by the table component
    return undefined;
  }

}