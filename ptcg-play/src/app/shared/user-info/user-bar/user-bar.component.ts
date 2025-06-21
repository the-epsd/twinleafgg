import { Component, Input } from '@angular/core';
import { UserInfo } from 'ptcg-server';

import { UserInfoPopupService } from '../user-info-popup/user-info-popup.service';

@Component({
  selector: 'ptcg-user-bar',
  templateUrl: './user-bar.component.html',
  styleUrls: ['./user-bar.component.scss']
})
export class UserBarComponent {

  @Input()
  set user(value: UserInfo) {
    this._user = value;
  }
  get user(): UserInfo {
    return this._user;
  }
  private _user: UserInfo;

  @Input() marked = false;
  @Input() openUserPopup = true;
  @Input() highlight: boolean;

  constructor(
    private userInfoPopupService: UserInfoPopupService
  ) { }

  public showUserInfoPopup(user: UserInfo) {
    if (!this.openUserPopup || !user.userId) {
      return;
    }

    this.userInfoPopupService.showUserInfo(user);
  }

}
