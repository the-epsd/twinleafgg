import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BattlePassComponent } from './battle-pass.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [{
  path: '',
  component: BattlePassComponent,
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BattlePassRoutingModule { }
