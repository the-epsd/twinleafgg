import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserInfo } from 'ptcg-server';
import { Observable, EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap } from 'rxjs/operators';

import { AlertService } from '../shared/alert/alert.service';
import { ProfileService } from '../api/services/profile.service';
import { SessionService } from '../shared/session/session.service';
import { ProfilePopupService } from './profile-popup.service';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { ChangeCardImagesPopupComponent } from './change-card-images-popup/change-card-images-popup.component';

@UntilDestroy()
@Component({
  selector: 'ptcg-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<UserInfo | undefined>;
  public loggedUserId: number;
  public loading: boolean;
  public userId: number;
  public owner$: Observable<boolean>;
  public isAdmin$: Observable<boolean>;
  public isBanned$: Observable<boolean>;

  constructor(
    private dialog: MatDialog,
    private alertService: AlertService,
    private profilePopupService: ProfilePopupService,
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private router: Router,
    private sessionService: SessionService,
    private translate: TranslateService
  ) {
    this.user$ = EMPTY;
    this.owner$ = EMPTY;
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

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(paramMap => {
        const userId = parseInt(paramMap.get('userId'), 10);
        this.userId = userId;
        this.owner$ = this.sessionService.get(session => session.loggedUserId === userId);
        this.user$ = this.sessionService.get(session => session.users[userId]);

        const user = this.sessionService.session.users[userId];
        if (user !== undefined) {
          return EMPTY;
        }
        this.loading = true;
        return this.profileService.getUser(userId);
      }),
      untilDestroyed(this)
    )
      .subscribe({
        next: response => {
          const user = response.user;
          const users = { ...this.sessionService.session.users };
          users[user.userId] = user;
          this.sessionService.set({ users });
          this.loading = false;
        },
        error: async error => {
          await this.alertService.error(this.translate.instant('PROFILE_LOADING_ERROR'));
          this.router.navigate(['/']);
        }
      });
  }

  openChangeCardImagesDialog(): void {
    this.dialog.open(ChangeCardImagesPopupComponent, {
      width: '600px',
      maxWidth: '90vw'
    });
  }

  changePassword() {
    this.profilePopupService.openChangePasswordPopup();
  }

  editAvatars(userId: number) {
    this.router.navigate(['/profile/select-avatar']);
  }

  changeEmail(userId: number) {
    this.profilePopupService.openChangeEmailPopup(userId);
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
      },
      error: async error => {
        await this.alertService.error(this.translate.instant(errorMessage));
      }
    });
  }

}
