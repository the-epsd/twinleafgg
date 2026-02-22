import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { AvatarInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, map } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { SessionService } from '../../shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-edit-avatars-popup',
  templateUrl: './edit-avatars-popup.component.html',
  styleUrls: ['./edit-avatars-popup.component.scss']
})
export class EditAvatarsPopupComponent implements OnInit {

  public displayedColumns: string[] = ['default', 'image', 'name'];
  public loading = false;
  public defaultAvatar$: Observable<string>;
  public avatars: AvatarInfo[] = [];
  private userId: number;
  private user$: Observable<any>;
  private user: any;

  constructor(
    private alertService: AlertService,
    private avatarService: AvatarService,
    private sessionService: SessionService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) data: { userId: number },
    private dialogRef: MatDialogRef<EditAvatarsPopupComponent>
  ) {
    this.userId = data.userId;
    this.user$ = this.sessionService.get(session => session.users[this.userId]);
    this.user$.pipe(untilDestroyed(this)).subscribe(user => this.user = user);
    this.defaultAvatar$ = this.user$.pipe(map(user => user ? user.avatarFile : ''));
  }

  public markAsDefault(avatar: AvatarInfo) {
    this.loading = true;
    const fileName = avatar.id === 0 ? avatar.fileName : undefined;
    this.avatarService.markAsDefault(avatar.id, fileName)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  ngOnInit() {
    this.refreshAvatars();
  }

  private refreshAvatars(): void {
    this.loading = true;
    this.avatarService.getAvailableAvatars()
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: response => {
          this.avatars = response.avatars;
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  public close(): void {
    this.dialogRef.close();
  }

  private getAvatarName(name: string = ''): Promise<string | undefined> {
    const invalidValues = this.avatars.map(a => a.name);
    return this.alertService.inputName({
      title: this.translate.instant('PROFILE_ENTER_AVATAR_NAME'),
      placeholder: this.translate.instant('PROFILE_AVATAR_NAME'),
      invalidValues,
      value: name
    });
  }

}
