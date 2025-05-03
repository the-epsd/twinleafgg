import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../shared/material.module';
import { BoardModule } from './board/board.module';
import { PromptModule } from './prompt/prompt.module';
import { TableComponent } from './table.component';
import { GameService } from '../api/services/game.service';
import { MessageService } from '../api/services/message.service';
import { TableSidebarComponent } from './table-sidebar/table-sidebar.component';

@NgModule({
  declarations: [
    TableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    SharedModule,
    MaterialModule,
    BoardModule,
    PromptModule,
    TableSidebarComponent
  ],
  exports: [
    TableComponent
  ],
  providers: [
    GameService,
    MessageService
  ]
})
export class TableModule { }
