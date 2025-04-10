import { Component, Input, OnInit } from '@angular/core';
import { Card, CardList, PlayerType, SlotType, CardTarget } from 'ptcg-server';
import { GameService } from '../../../api/services/game.service';
import { CardsBaseService } from '../../../shared/cards/cards-base.service';

@Component({
  selector: 'ptcg-starting-pokemon-overlay',
  template: `
    <div class="starting-pokemon-overlay" *ngIf="isVisible">
      <div class="cards-container">
        <ptcg-card 
          *ngFor="let card of cards; let i = index"
          [card]="card"
          (click)="onCardClick(card, i)">
        </ptcg-card>
      </div>
    </div>
  `,
  styles: [`
    .starting-pokemon-overlay {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      pointer-events: all;
    }
    .cards-container {
      display: flex;
      justify-content: center;
      gap: 4px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.5);
    }
    ptcg-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    ptcg-card:hover {
      transform: translateY(-10px);
    }
  `]
})
export class StartingPokemonOverlayComponent implements OnInit {
  @Input() cards: Card[] = [];
  @Input() gameId: number;
  @Input() isVisible: boolean = false;

  constructor(
    private gameService: GameService,
    private cardsBaseService: CardsBaseService
  ) { }

  ngOnInit() { }

  onCardClick(card: Card, index: number) {
    // Find first empty bench slot
    const target: CardTarget = {
      player: PlayerType.BOTTOM_PLAYER,
      slot: SlotType.BENCH,
      index: 0 // We'll let the server handle finding the right slot
    };

    this.gameService.playCardAction(this.gameId, index, target);
  }
} 