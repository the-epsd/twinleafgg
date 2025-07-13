import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ShowCardsPrompt, Card, GamePhase, SuperType } from 'ptcg-server';

import { CardsBaseService } from '../../../shared/cards/cards-base.service';
import { GameService } from '../../../api/services/game.service';
import { LocalGameState } from '../../../shared/session/session.interface';
import { Subject, timer } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ptcg-prompt-show-cards',
  templateUrl: './prompt-show-cards.component.html',
  styleUrls: ['./prompt-show-cards.component.scss']
})
export class PromptShowCardsComponent implements OnInit, OnDestroy {

  @Input() prompt: ShowCardsPrompt;
  @Input() gameState: LocalGameState;

  public isLoading = true;
  public sortDiscards: boolean = false;

  private isResolved = false;
  private timeoutId: any;
  private destroyed$ = new Subject<void>();

  constructor(
    private cardsBaseService: CardsBaseService,
    private gameService: GameService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    timer(3000).pipe(
      take(1),
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.resolvePrompt();
    });
    if (this.sortDiscards) {
      this.prompt.cards = this.sortDiscardCards(this.prompt.cards);
    }
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  public minimize() {
    this.gameService.setPromptMinimized(this.gameState.localId, true);
  }

  private resolvePrompt() {
    if (!this.isResolved) {
      this.isResolved = true;
      const gameId = this.gameState.gameId;
      const id = this.prompt.id;
      this.gameService.resolvePrompt(gameId, id, null);
    }
  }

  public confirm() {
    this.resolvePrompt();
  }

  public cancel() {
    this.resolvePrompt();
    const gameId = this.gameState.gameId;
    const id = this.prompt.id;
    // this.gameService.resolvePrompt(gameId, id, null);
  }

  public onCardClick(card: Card) {
    this.cardsBaseService.showCardInfo({ card });
  }

  private sortDiscardCards(cards: Card[]): Card[] {
    const pokemonCards = cards.filter(c => c.superType === SuperType.POKEMON);
    const trainerCards = cards.filter(c => c.superType === SuperType.TRAINER);
    const energyCards = cards.filter(c => c.superType === SuperType.ENERGY);

    return [
      ...pokemonCards,
      ...trainerCards,
      ...energyCards
    ];
  }
}