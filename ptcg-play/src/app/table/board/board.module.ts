import { NgModule } from '@angular/core';
import { BoardComponent } from './board.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';
import { CoinFlipComponent } from '../prompt/coin-flip-prompt/coin-flip.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    BoardComponent,
    BoardPrizesComponent,
    BoardDeckComponent,
    BoardCardComponent,
    CoinFlipComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent
  ]
})
export class BoardModule { }
