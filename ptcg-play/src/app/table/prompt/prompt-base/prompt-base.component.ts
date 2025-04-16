import { Host, Optional } from '@angular/core';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PromptComponent } from '../prompt.component';

/**
 * Base class for all prompt components to extend
 * Provides access to parent prompt component for animations
 */
export class PromptBaseComponent {
  constructor(
    protected gameService: GameService,
    @Host() @Optional() protected parentPrompt: PromptComponent
  ) { }

  /**
   * Minimize the prompt with animation if parent is available
   */
  public minimizeWithAnimation() {
    // If we have access to parent prompt component, use its minimize method for animation
    if (this.parentPrompt) {
      this.parentPrompt.minimize();
    } else {
      // Fallback to direct state change (override in child classes)
      this.minimizeFallback();
    }
  }

  /**
   * Default implementation - should be overridden in child classes
   */
  protected minimizeFallback() {
    console.warn('minimizeFallback not implemented');
  }

  /**
   * Cancel with animation if parent is available
   */
  public cancelWithAnimation(gameId: number, promptId: number) {
    if (this.parentPrompt) {
      // Use animated cancel
      this.parentPrompt.animateAndResolvePrompt(gameId, promptId, null);
    } else {
      // Fallback to direct action
      this.gameService.resolvePrompt(gameId, promptId, null);
    }
  }

  /**
   * Confirm with animation if parent is available
   */
  public confirmWithAnimation(gameId: number, promptId: number, result: any) {
    if (this.parentPrompt) {
      // Use animated confirm
      this.parentPrompt.animateAndResolvePrompt(gameId, promptId, result);
    } else {
      // Fallback to direct action
      this.gameService.resolvePrompt(gameId, promptId, result);
    }
  }
} 