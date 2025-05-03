import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../shared/material.module';
import { BoardCardComponent, CardInfoDialogComponent } from './board-card/board-card.component';
import { BoardPrizesComponent } from './board-prizes/board-prizes.component';
import { BoardDeckComponent } from './board-deck/board-deck.component';
import { BoardSelectionOverlayComponent } from './board-selection-overlay/board-selection-overlay.component';

@NgModule({
  declarations: [
    BoardCardComponent,
    BoardPrizesComponent,
    BoardDeckComponent,
    BoardSelectionOverlayComponent,
    CardInfoDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    BoardCardComponent,
    BoardPrizesComponent,
    BoardDeckComponent,
    BoardSelectionOverlayComponent,
    CardInfoDialogComponent
  ]
})
export class BoardModule { }
