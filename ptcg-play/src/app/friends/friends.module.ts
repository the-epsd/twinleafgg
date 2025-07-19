import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { FriendsComponent } from './friends.component';
import { FriendsListComponent } from './friends-list/friends-list.component';
import { FriendRequestsComponent } from './friend-requests/friend-requests.component';
import { SendFriendRequestComponent } from './send-friend-request/send-friend-request.component';

@NgModule({
  declarations: [
    FriendsComponent,
    FriendsListComponent,
    FriendRequestsComponent,
    SendFriendRequestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule
  ],
  exports: [
    FriendsComponent
  ]
})
export class FriendsModule { } 