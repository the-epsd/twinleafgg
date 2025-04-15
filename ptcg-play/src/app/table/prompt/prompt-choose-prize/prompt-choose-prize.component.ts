import { Component, Input, OnChanges } from '@angular/core';
import { Card, ChoosePrizePrompt, CardList } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-prize',
  templateUrl: './prompt-choose-prize.component.html',
  styleUrls: ['./prompt-choose-prize.component.scss']
})
export class PromptChoosePrizeComponent implements OnChanges {

  @Input() prompt: ChoosePrizePrompt;
  @Input() gameState: LocalGameState;

  public cards: Card[];
  public prizes: (CardList | null)[] = new Array(6).fill(null);
  public cardbackMap: { [index: number]: boolean } = {};
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;
  public hasSecret: boolean;
  public revealed = false;
  private result: number[] = [];

  // Maps grid positions to the index of non-empty prizes only
  private prizeIndexMap: { [visualIndex: number]: number } = {};
  // Maps from the grid position index to actual prize array index
  private gridToPrizeMap: { [gridIndex: number]: number } = {};
  // Maps from the non-empty prize index to grid position
  private prizeToGridMap: { [prizeIndex: number]: number } = {};

  // Property to force re-render of the component
  public revealToggleCount = 0;

  constructor(
    private gameService: GameService
  ) { }

  // Toggle card reveal in replay mode
  public toggleReveal(): void {
    this.revealed = !this.revealed;
    this.revealToggleCount++; // Increment counter to force component update

    console.log('Cards revealed:', this.revealed);

    // Force refresh by temporarily resetting and then restoring the prizes array
    setTimeout(() => {
      const tempPrizes = [...this.prizes];
      this.prizes = new Array(6).fill(null);

      // Wait for Angular to detect this change
      setTimeout(() => {
        this.prizes = tempPrizes;
      }, 0);
    }, 0);
  }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  public cancel() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    this.gameService.resolvePrompt(gameId, id, null);
  }

  public confirm() {
    const gameId = this.gameState.gameId;
    const id = this.promptId;
    console.log('Confirming with prize indexes:', this.result);
    this.gameService.resolvePrompt(gameId, id, this.result);
  }

  public onPrizeClick(prize: CardList, gridIndex: number) {
    // Ignore clicks on empty prize slots
    if (!prize || prize.cards.length === 0) {
      return;
    }

    // The server expects an index into the filtered list of non-empty prizes
    const nonEmptyPrizeIndex = this.prizeIndexMap[gridIndex];

    if (nonEmptyPrizeIndex === undefined) {
      console.error('No prize index mapping for grid index:', gridIndex);
      return;
    }

    const count = this.prompt.options.count || 1;
    const isCurrentlySelected = this.isPrizeSelected(gridIndex);

    // Single selection mode (most common case)
    if (count === 1) {
      if (isCurrentlySelected) {
        // If already selected, unselect it
        this.result = [];
      } else {
        // Clear previous selections and select the new one
        this.result = [nonEmptyPrizeIndex];
      }
    } else {
      // Multiple selection mode
      if (isCurrentlySelected) {
        // If already selected, remove it from selection
        const index = this.result.indexOf(nonEmptyPrizeIndex);
        if (index !== -1) {
          this.result.splice(index, 1);
        }
      } else if (this.result.length < count) {
        // If not selected and we haven't reached the limit, add it
        this.result.push(nonEmptyPrizeIndex);
      }
    }

    console.log('Selected prize at grid index', gridIndex,
      'prize array index', this.gridToPrizeMap[gridIndex],
      'non-empty prize index', nonEmptyPrizeIndex,
      'is selected:', this.isPrizeSelected(gridIndex));

    // Update validation state
    this.isInvalid = this.result.length !== count;
  }

  // Check if a prize is selected by comparing the actual prize index
  public isPrizeSelected(gridIndex: number): boolean {
    const nonEmptyPrizeIndex = this.prizeIndexMap[gridIndex];
    return nonEmptyPrizeIndex !== undefined && this.result.indexOf(nonEmptyPrizeIndex) !== -1;
  }

  // Keep this for backward compatibility
  public onChange(result: number[]) {
    const count = this.prompt.options.count;
    this.result = result;
    this.isInvalid = result.length !== count;
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const player = state.players.find(p => p.id === this.prompt.playerId);
      if (player === undefined) {
        return;
      }

      // Reset all maps
      this.gridToPrizeMap = {};
      this.prizeToGridMap = {};
      this.prizeIndexMap = {};

      // Initialize the prizes array (for grid display)
      this.prizes = new Array(6).fill(null);

      console.log('Player prizes:', player.prizes);

      // Map player prizes to our grid positions (actual prizes array)
      player.prizes.forEach((prize, prizeArrayIndex) => {
        if (prizeArrayIndex < 6) {
          // Store the prize in the grid at the same position
          this.prizes[prizeArrayIndex] = prize;
          // Map grid index to prize array index
          this.gridToPrizeMap[prizeArrayIndex] = prizeArrayIndex;
          // Map prize array index to grid index
          this.prizeToGridMap[prizeArrayIndex] = prizeArrayIndex;
        }
      });

      // Create the non-empty prize index mapping that the server expects
      // The server expects indexes into the filtered array of non-empty prizes
      const nonEmptyPrizes = player.prizes.filter(p => p.cards.length > 0);
      console.log('Non-empty prizes:', nonEmptyPrizes);

      // Each non-empty prize gets a sequential index
      nonEmptyPrizes.forEach((prize, nonEmptyIndex) => {
        // Find the original index of this prize in the player.prizes array
        const originalPrizeIndex = player.prizes.indexOf(prize);
        // Map the grid index to the non-empty prize index
        this.prizeIndexMap[originalPrizeIndex] = nonEmptyIndex;

        console.log(`Mapping grid index ${originalPrizeIndex} to non-empty prize index ${nonEmptyIndex}`);
      });

      // Still maintain the original cards array for compatibility
      const cards: Card[] = [];
      const cardbackMap: { [index: number]: boolean } = {};
      player.prizes.forEach((prize) => {
        prize.cards.forEach(card => {
          cardbackMap[cards.length] = prize.isSecret;
          cards.push(card);
        });
      });

      this.hasSecret = player.prizes.some(p => p.cards.length > 0 && p.isSecret);
      this.cards = cards;
      this.cardbackMap = cardbackMap;
      this.allowedCancel = prompt.options.allowCancel;
      this.message = prompt.message;
      this.promptId = prompt.id;
      this.result = [];
      this.isInvalid = true;

      // Reset revealed state whenever the prompt changes
      this.revealed = false;
      this.revealToggleCount = 0;
    }
  }
}