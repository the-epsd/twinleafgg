import { NgModule } from '@angular/core';

import { SpectateComponent } from './spectate.component';
import { SharedModule } from '../shared/shared.module';
import { GamesModule } from '../games/games.module';

@NgModule({
  declarations: [
    SpectateComponent
  ],
  imports: [
    SharedModule,
    GamesModule
  ]
})
export class SpectateModule { }
