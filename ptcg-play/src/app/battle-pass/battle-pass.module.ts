import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BattlePassRoutingModule } from './battle-pass-routing.module';
import { BattlePassComponent } from './battle-pass.component';


@NgModule({
  declarations: [
    BattlePassComponent
  ],
  imports: [
    CommonModule,
    BattlePassRoutingModule
  ]
})
export class BattlePassModule { }
