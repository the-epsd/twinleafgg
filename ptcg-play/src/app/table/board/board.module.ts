import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardComponent } from './board.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';
import { CoinFlipComponent } from '../prompt/coin-flip-prompt/coin-flip.component';
import { CardInfoDialogComponent } from './board-card/board-card.component';
import { PokemonCardInfoPaneComponent } from '../../shared/cards/pokemon-card-info-pane/pokemon-card-info-pane.component';
import { CardsModule } from 'src/app/shared/cards/cards.module';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    CardsModule
  ],
  declarations: [
    BoardComponent,
    BoardPrizesComponent,
    BoardDeckComponent,
    BoardCardComponent,
    CoinFlipComponent,
    CardInfoDialogComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent
  ]
})
export class BoardModule { }
