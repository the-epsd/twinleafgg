import { Component, Input } from '@angular/core';
import { ChooseCardsPrompt, CardList, Card } from 'ptcg-server';

import { GameService } from '../../../api/services/game.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { LocalGameState } from '../../../shared/session/session.interface';

@Component({
  selector: 'ptcg-choose-starting-pokemon',
  templateUrl: './choose-starting-pokemon-prompt.component.html',
  styleUrls: ['./choose-starting-pokemon-prompt.component.scss']
})
export class ChooseStartingPokemonPromptComponent {

  @Input() set prompt(prompt: ChooseCardsPrompt) {
    this.promptValue = prompt;
    this.cards = prompt.cards;
    this.filter = prompt.filter;
    this.allowedCancel = prompt.options.allowCancel;
    this.blocked = prompt.options.blocked;
    this.message = prompt.message;
    this.promptId = prompt.id;
    this.isSecret = prompt.options.isSecret;

    if (prompt.options.isSecret) {
      prompt.cards.cards.forEach((c, i) => {
        this.cardbackMap[i] = true;
      });
    }
    this.cardbackUrl = this.cardsBaseService.getSleeveUrl((this.cards as any)?.sleeveImagePath);
  }

  @Input() gameState: LocalGameState;

  public cards: CardList;
  public allowedCancel: boolean;
  public promptId: number;
  public message: string;
  public filter: Partial<Card>;
  public blocked: number[];
  public isInvalid = false;
  public isSecret: boolean;
  public revealed = false;
  public cardbackMap: { [index: number]: boolean } = {};
  public cardbackUrl?: string;
  private promptValue: ChooseCardsPrompt;
  private result: number[] = [];

  constructor(
    private gameService: GameService,
    private cardsBaseService: CardsBaseService
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
    const cards = result.map(index => this.cards.cards[index]);
    const isInvalid = !this.promptValue.validate(cards);
    this.result = result;
    this.isInvalid = isInvalid;


  }

}
