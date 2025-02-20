import { Component, Input } from '@angular/core';
import {
  ChooseToolPrompt, CardList, Card, SuperType, CardType, StateUtils,
  EnergyMap,
  TrainerType,
  TrainerCard
} from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-prompt-choose-energy',
  templateUrl: './prompt-choose-energy.component.html',
  styleUrls: ['./prompt-choose-energy.component.scss']
})
export class PromptChooseToolComponent {

  @Input() set prompt(prompt: ChooseToolPrompt) {
    this.cards = new CardList();
    this.tools = prompt.tools;
    this.filter = { trainerType: TrainerType.TOOL };
    this.min = prompt.options.min;
    this.max = prompt.options.max;
    this.allowedCancel = prompt.options.allowCancel;
    this.message = prompt.message;
    this.promptId = prompt.id;
  }

  @Input() gameState: LocalGameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<TrainerCard>;
  public min: number = 1;
  public max: number = 1;
  public isInvalid = false;
  private tools: Card[] = [];
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
    const tools: Card[] = [];
    const prompt = this.prompt;
    for (const index of result) {
      tools.push(this.tools[index]);
    }

    this.allowedCancel = prompt.options.allowCancel;
    this.min = prompt.options.min;
    this.max = prompt.options.max;

    this.result = result;
    this.isInvalid = !(this.isInvalid = this.min > this.result.length || this.max < this.result.length);
  }

}
