import { Component, Host, Input, OnChanges, Optional } from '@angular/core';
import { Card, CardList, ChoosePrizePrompt } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { PromptComponent } from '../prompt.component';

@Component({
  selector: 'ptcg-prompt-choose-prize',
  templateUrl: './prompt-choose-prize.component.html',
  styleUrls: ['./prompt-choose-prize.component.scss'],
})
export class PromptChoosePrizeComponent implements OnChanges {

  @Input() prompt: ChoosePrizePrompt | null = null;
  @Input() gameState: LocalGameState | null = null;

  public cards: Card[] = [];
  public cardbackMap: { [index: number]: boolean } = {};
  public allowedCancel: boolean = false;
  public promptId: number = 0;
  public message: string = '';
  public isInvalid = false;
  public hasSecret: boolean = false;
  public revealed = false;
  private result: number[] = [];

  constructor(
    private gameService: GameService
  ) { }

  public minimize() {
    if (this.gameState) {
      this.gameService.setPromptMinimized(this.gameState.localId, true);
    }
  }

  public cancel() {
    if (this.gameState) {
      const gameId = this.gameState.gameId;
      const id = this.promptId;
      this.gameService.resolvePrompt(gameId, id, null);
    }
  }

  public confirm() {
    if (this.gameState) {
      const gameId = this.gameState.gameId;
      const id = this.promptId;
      this.gameService.resolvePrompt(gameId, id, this.result);
    }
  }

  public onChange(result: number[]) {
    if (this.prompt) {
      const count = this.prompt.options.count;
      this.result = result;
      this.isInvalid = result.length !== count;
    }
  }

  ngOnChanges() {
    if (this.prompt && this.gameState && !this.promptId) {
      const state = this.gameState.state;
      const prompt = this.prompt;
      const player = state.players.find(p => p.id === this.prompt!.playerId);
      if (player === undefined) {
        return;
      }

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
    }
  }
}