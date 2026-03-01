import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BattlePassRoutingModule } from './battle-pass-routing.module';
import { BattlePassComponent } from './battle-pass.component';
import { PreventWheelScrollDirective } from '../shared/prevent-wheel-scroll.directive';


@NgModule({
  declarations: [
    BattlePassComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BattlePassRoutingModule,
    PreventWheelScrollDirective
  ]
})
export class BattlePassModule { }
