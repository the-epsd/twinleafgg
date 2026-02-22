import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { BoardComponent } from './board.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardCardComponent } from './board-card/board-card.component';
import { SharedModule } from '../../shared/shared.module';
import { CardsModule } from 'src/app/shared/cards/cards.module';
import { BoardSelectionOverlayComponent } from './board-selection-overlay/board-selection-overlay.component';
import { VisualCoinFlipComponent } from './visual-coin-flip/visual-coin-flip.component';
import { AttackEffectOverlayComponent } from './board-card/attack-effect-overlay/attack-effect-overlay.component';
import { Board3dModule } from './board-3d.module';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    SharedModule,
    CardsModule,
    Board3dModule
  ],
  declarations: [
    BoardComponent,
    BoardPrizesComponent,
    BoardDeckComponent,
    BoardCardComponent,
    BoardSelectionOverlayComponent,
    VisualCoinFlipComponent,
    AttackEffectOverlayComponent
  ],
  exports: [
    BoardComponent,
    BoardCardComponent,
    Board3dModule,
    BoardSelectionOverlayComponent
  ]
})
export class BoardModule { }
