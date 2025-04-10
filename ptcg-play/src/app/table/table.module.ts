import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DndModule } from '@ng-dnd/core';
import { DndSortableModule } from '@ng-dnd/sortable';

import { BoardModule } from './board/board.module';
import { HandComponent } from './hand/hand.component';
import { PromptModule } from './prompt/prompt.module';
import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';
import { TableSidebarModule } from './table-sidebar/table-sidebar.module';
import { VsScreenComponent } from './vs-screen/vs-screen.component';
import { GameOverComponent } from './game-over/game-over.component';
import { StartingPokemonOverlayComponent } from './prompt/prompt-choose-cards/starting-pokemon-overlay.component';

@NgModule({
  declarations: [
    TableComponent,
    HandComponent,
    VsScreenComponent,
    GameOverComponent,
    StartingPokemonOverlayComponent
  ],
  imports: [
    BoardModule,
    PromptModule,
    SharedModule,
    TableSidebarModule,
    CommonModule,
    DndModule,
    DndSortableModule
  ],
  providers: [],
  exports: [
    TableComponent
  ]
})
export class TableModule { }
