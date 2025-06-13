import { Component, OnInit, OnDestroy } from '@angular/core';
import { BoardInteractionService } from '../../../shared/services/board-interaction.service';
import { GameService } from '../../../api/services/game.service';
import { Subscription } from 'rxjs';
import { ChoosePokemonPrompt, CardTarget } from 'ptcg-server';

@Component({
  selector: 'ptcg-board-selection-overlay',
  templateUrl: './board-selection-overlay.component.html',
  styleUrls: ['./board-selection-overlay.component.scss']
})
export class BoardSelectionOverlayComponent implements OnInit, OnDestroy {
  public isActive = false;
  public prompt: ChoosePokemonPrompt;
  public message: string;
  public minSelections = 1;
  public maxSelections = 1;
  public selectedCount = 0;
  public isValid = false;
  public allowCancel = true;

  private subscriptions: Subscription[] = [];

  constructor(
    private boardInteractionService: BoardInteractionService,
    private gameService: GameService
  ) { }

  ngOnInit(): void {
    // Subscribe to selection mode changes
    this.subscriptions.push(
      this.boardInteractionService.selectionMode$.subscribe(active => {
        this.isActive = active;
        // If selection mode is deactivated, clear prompt state
        if (!active) {
          this.prompt = null;
        }
      })
    );

    // Subscribe to prompt changes
    this.subscriptions.push(
      this.boardInteractionService.prompt$.subscribe(prompt => {
        if (prompt) {
          this.prompt = prompt;
          this.message = prompt.message;
          this.minSelections = prompt.options.min;
          this.maxSelections = prompt.options.max;
          this.allowCancel = prompt.options.allowCancel;
        } else {
          this.prompt = null;
        }
      })
    );

    // Subscribe to selection changes
    this.subscriptions.push(
      this.boardInteractionService.selectedTargets$.subscribe(targets => {
        this.selectedCount = targets.length;
        this.updateValidity();
      })
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Confirm the current selection
   */
  public confirm(): void {
    if (this.isValid) {
      this.boardInteractionService.confirmSelection();
    }
  }

  /**
   * Cancel the current selection
   */
  public cancel(): void {
    if (this.allowCancel) {
      this.boardInteractionService.cancelSelection();
    }
  }

  /**
   * Update selection validity
   */
  private updateValidity(): void {
    this.isValid = this.boardInteractionService.isSelectionValid();
  }
} 