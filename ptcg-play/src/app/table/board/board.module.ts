import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { BoardComponent } from './board.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';
import { CardsModule } from 'src/app/shared/cards/cards.module';
import { BoardSelectionOverlayComponent } from './board-selection-overlay/board-selection-overlay.component';
import { VisualCoinFlipComponent } from './visual-coin-flip/visual-coin-flip.component';

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
    BoardSelectionOverlayComponent,
    VisualCoinFlipComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent
  ]
})
export class BoardModule { }
