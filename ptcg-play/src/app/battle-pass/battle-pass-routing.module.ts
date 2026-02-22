import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattlePassComponent } from './battle-pass.component';
import { authGuard } from '../shared/guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: BattlePassComponent,
  canActivate: [authGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BattlePassRoutingModule { }
