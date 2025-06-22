import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { UserInfo } from 'ptcg-server';

@Component({
  selector: 'ptcg-user-info-pane',
  templateUrl: './user-info-pane.component.html',
  styleUrls: ['./user-info-pane.component.scss']
})
export class UserInfoPaneComponent implements OnChanges {

  @Input() user: UserInfo;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.user && changes.user.currentValue) {
      console.log('[DEBUG] UserInfoPane received user data:', changes.user.currentValue);
      console.log('[DEBUG] UserInfoPane custom avatar data:', changes.user.currentValue.customAvatar);
    }
  }

}
