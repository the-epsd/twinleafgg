import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';

import { AlertService } from '../../../shared/alert/alert.service';
import { ProfileService } from '../../../api/services/profile.service';
import { SessionService } from '../../../shared/session/session.service';
import { TranslateService } from '@ngx-translate/core';

export interface UserInfoPopupData {
  user: UserInfo;
}

@Component({
  selector: 'ptcg-user-info-popup',
  templateUrl: './user-info-popup.component.html',
  styleUrls: ['./user-info-popup.component.scss']
})
export class UserInfoPopupComponent {

  public user: UserInfo;
  public userId: number;
  public visitor$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public isBanned$: Observable<boolean>;

  constructor(
    private alertService: AlertService,
    private dialogRef: MatDialogRef<UserInfoPopupComponent>,
    private profileService: ProfileService,
    private sessionService: SessionService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: UserInfoPopupData
  ) {
    this.user = data.user;
    this.userId = data.user.userId;
    this.visitor$ = this.sessionService.get(session => session.loggedUserId !== this.userId);
    this.isAdmin$ = this.sessionService.get(session => {
      const loggedUserId = session.loggedUserId;
      const loggedUser = loggedUserId && session.users[loggedUserId];
      return loggedUser && loggedUser.roleId === 4;
    });
    this.isBanned$ = this.sessionService.get(session => {
      const user = session.users[this.userId];
      return user && user.roleId === 1;
    });
  }

  public close() {
    this.dialogRef.close();
  }

  banUser(userId: number) {
    const isBanned = this.sessionService.session.users[userId]?.roleId === 1;
    const newRoleId = isBanned ? 2 : 1; // 2 is regular user, 1 is banned
    const successMessage = isBanned ? 'PROFILE_UNBAN_SUCCESS' : 'PROFILE_BAN_SUCCESS';
    const errorMessage = isBanned ? 'PROFILE_UNBAN_ERROR' : 'PROFILE_BAN_ERROR';

    this.profileService.updateUserRole(userId, newRoleId).subscribe({
      next: () => {
        this.alertService.toast(this.translate.instant(successMessage));
        const users = { ...this.sessionService.session.users };
        if (users[userId]) {
          users[userId] = { ...users[userId], roleId: newRoleId };
          this.sessionService.set({ users });
        }
        this.close();
      },
      error: async error => {
        await this.alertService.error(this.translate.instant(errorMessage));
      }
    });
  }
}
