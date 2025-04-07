import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FriendsComponent } from './friends.component';

@NgModule({
  declarations: [
    FriendsComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild([
      { path: '', component: FriendsComponent }
    ])
  ],
  exports: [
    FriendsComponent
  ]
})
export class FriendsModule { } 