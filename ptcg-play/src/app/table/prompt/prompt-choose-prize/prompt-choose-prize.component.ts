// import { Component, Input, OnChanges } from '@angular/core';
// import { Card, ChoosePrizePrompt } from 'ptcg-server';

// import { GameService } from '../../../api/services/game.service';
// import { LocalGameState } from '../../../shared/session/session.interface';

// @Component({
//   selector: 'ptcg-prompt-choose-prize',
//   templateUrl: './prompt-choose-prize.component.html',
//   styleUrls: ['./prompt-choose-prize.component.scss']
// })
// export class PromptChoosePrizeComponent implements OnChanges {

//   @Input() prompt: ChoosePrizePrompt;
//   @Input() gameState: LocalGameState;
//   @Input() maxCards: number;
//   @Input() promptValue: ChoosePrizePrompt;

//   public cards: Card[];
//   public cardbackMap: { [index: number]: boolean } = {};
//   public allowedCancel: boolean;
//   public promptId: number;
//   public message: string;
//   public isInvalid = false;
//   public isSecret: boolean;
//   public hasSecret: boolean;
//   public revealed = false;
//   private result: number[] = [];
//   public selectedCardIsSecret = false;
//   public prizeIndexMap: { [cardIndex: number]: number } = {};
//   public selectedCardbackMap: { [index: number]: boolean } = {};

//   constructor(
//     private gameService: GameService
//   ) { }

//   public minimize() {
//     this.gameService.setPromptMinimized(this.gameState.localId, true);
//   }

//   public cancel() {
//     const gameId = this.gameState.gameId;
//     const id = this.promptId;
//     this.gameService.resolvePrompt(gameId, id, null);
//   }

//   public confirm() {
//     const gameId = this.gameState.gameId;
//     const id = this.promptId;
//     this.gameService.resolvePrompt(gameId, id, this.result);
//   }

//   ngOnInit() {
//     this.maxCards = this.prompt.options.count || 1;
//   }

//   public onChange(result: number[]) {
//     const cardIndex = result[0];
//     const prizeIndex = this.prizeIndexMap[cardIndex];
//     this.result = [prizeIndex];
//     this.isInvalid = this.result.length !== this.prompt.options.count;
//     this.selectedCardbackMap[cardIndex] = this.cardbackMap[cardIndex];
//   }

//   ngOnChanges() {
//     if (this.prompt && this.gameState && !this.promptId) {
//       const state = this.gameState.state;
//       const player = state.players.find(p => p.id === this.prompt.playerId);
//       if (player === undefined) {
//         return;
//       }

//       const cards: Card[] = [];
//       const cardbackMap: { [index: number]: boolean } = {};
//       const prizeIndexMap: { [cardIndex: number]: number } = {};

//       this.maxCards = this.prompt.options.count;
//       this.isSecret = this.prompt.options.isSecret;

//       player.prizes.forEach((prize, prizeIndex) => {
//         prize.cards.forEach(card => {
//           prizeIndexMap[cards.length] = prizeIndex;
//           cardbackMap[cards.length] = prize.isSecret || this.isSecret;
//           cards.push(card);
//         });
//       });

//       this.hasSecret = player.prizes.some(p => p.cards.length > 0 && p.isSecret) || this.isSecret;
//       this.cards = cards;
//       this.cardbackMap = cardbackMap;
//       this.prizeIndexMap = prizeIndexMap;
//       this.allowedCancel = this.prompt.options.allowCancel;
//       this.message = this.prompt.message;
//       this.promptId = this.prompt.id;
//     }
//   }
// }

import { Component, Input, OnChanges } from '@angular/core';
import { Card, ChoosePrizePrompt } from 'ptcg-server';

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
  public cardbackMap: { [index: number]: boolean } = {};
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public isInvalid = false;
  public hasSecret: boolean;
  public revealed = false;
  private result: number[] = [];

  constructor(
    private gameService: GameService
  ) { }

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
    this.gameService.resolvePrompt(gameId, id, this.result);
  }

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