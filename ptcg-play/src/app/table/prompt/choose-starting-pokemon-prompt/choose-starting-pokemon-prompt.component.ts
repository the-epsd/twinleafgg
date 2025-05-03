import { Component, Input, OnChanges } from '@angular/core';
import { ChooseCardsPrompt, CardList, Card, CardTarget, ChoosePokemonPrompt, PlayerType, SlotType } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { BoardInteractionService } from 'src/app/shared/services/board-interaction.service';

@Component({
  selector: 'ptcg-choose-starting-pokemon',
  templateUrl: './choose-starting-pokemon-prompt.component.html',
  styleUrls: ['./choose-starting-pokemon-prompt.component.scss']
})
export class ChooseStartingPokemonPromptComponent implements OnChanges {
  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.promptValue = prompt;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.promptId = prompt.id;
    this.message = prompt.message;
    this.blocked = prompt.options.blocked || [];
    this.allowedCancel = prompt.options.allowCancel;
    this.isSecret = prompt.options.isSecret;

    // Always start minimized in interactive mode
    if (this.useInteractiveBoard && !this.gameState?.replay) {
      this.gameService.setPromptMinimized(this.gameState.gameId, true);
    }
  }

  @Input() gameState: LocalGameState;

  public cards: CardList;
  public filter: Partial<Card>;
  public promptId: number;
  public message: string;
  public promptValue: ChooseCardsPrompt;
  public blocked: number[] = [];
  public allowedCancel = false;
  public isSecret = false;
  public isInvalid = true;
  public revealed = false;
  public useInteractiveBoard = true;

  constructor(
    private gameService: GameService,
    private boardInteractionService: BoardInteractionService
  ) { }

  ngOnChanges() {
    if (this.gameState?.replay) {
      this.useInteractiveBoard = false;
      this.boardInteractionService.setReplayMode(true);
    } else if (this.gameState) {
      this.boardInteractionService.setReplayMode(false);

      // Ensure prompt is minimized in interactive mode
      if (this.useInteractiveBoard) {
        this.gameService.setPromptMinimized(this.gameState.gameId, true);
      }
    }

    if (this.promptValue && this.gameState && this.useInteractiveBoard) {
      this.startInteractiveBoardSelection();
    }
  }

  onDragStart(event: DragEvent, card: Card, index: number) {
    if (this.blocked.includes(index)) {
      event.preventDefault();
      return;
    }

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify({
        cardIndex: index,
        promptId: this.promptId,
        sourceType: 'hand'
      }));

      // Create a ChoosePokemonPrompt for board selection
      const pokemonPrompt = new ChoosePokemonPrompt(
        this.promptValue.playerId,
        this.promptValue.message,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        {
          min: 1,
          max: 1,
          allowCancel: this.promptValue.options.allowCancel,
          blocked: []
        }
      );

      // Start board selection mode when dragging
      this.boardInteractionService.startBoardSelection(
        pokemonPrompt,
        (targets: CardTarget[]) => {
          if (targets === null) {
            this.cancel();
          } else {
            this.gameService.resolvePrompt(this.gameState.gameId, this.promptId, targets);
          }
        }
      );
    }
  }

  onDragEnd() {
    // Reset any drag state if needed
  }

  cancel() {
    if (!this.allowedCancel) {
      return;
    }
    this.gameService.resolvePrompt(this.gameState.gameId, this.promptId, null);
  }

  private startInteractiveBoardSelection() {
    // Create a new instance of ChoosePokemonPrompt with the correct parameters
    const pokemonPrompt = new ChoosePokemonPrompt(
      this.promptValue.playerId,
      this.promptValue.message,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH],
      {
        min: 1,
        max: 1,
        allowCancel: this.promptValue.options.allowCancel,
        blocked: []
      }
    );

    this.boardInteractionService.startBoardSelection(
      pokemonPrompt,
      (targets: CardTarget[]) => {
        if (targets === null) {
          this.cancel();
        } else {
          this.gameService.resolvePrompt(this.gameState.gameId, this.promptId, targets);
        }
      }
    );
  }
}
