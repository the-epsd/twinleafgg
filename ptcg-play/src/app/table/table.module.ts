import { NgModule } from '@angular/core';

import { BoardModule } from './board/board.module';
import { HandComponent } from './hand/hand.component';
import { PromptModule } from './prompt/prompt.module';
import { SharedModule } from '../shared/shared.module';
import { TableComponent } from './table.component';
import { TableSidebarModule } from './table-sidebar/table-sidebar.module';
import { VsScreenComponent } from './vs-screen/vs-screen.component';
import { MatchResultsSplashComponent } from './match-results-splash/match-results-splash.component';
import { GameOverComponent } from './game-over/game-over.component';
import { XpGainScreenComponent } from './xp-gain-screen/xp-gain-screen.component';
import { SandboxControlComponent } from './sandbox-control/sandbox-control.component';

@NgModule({
  declarations: [
    TableComponent,
    HandComponent,
    VsScreenComponent,
    MatchResultsSplashComponent,
    GameOverComponent,
    XpGainScreenComponent,
    SandboxControlComponent
  ],
  imports: [
    BoardModule,
    PromptModule,
    SharedModule,
    TableSidebarModule
  ],
  providers: []
})
export class TableModule { }
