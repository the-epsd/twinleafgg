import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';

import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { AvatarService } from '../../api/services/avatar.service';
import { SessionService } from '../../shared/session/session.service';
import { ApiService } from '../../api/api.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-select-avatar',
  templateUrl: './select-avatar.component.html',
  styleUrls: ['./select-avatar.component.scss']
})
export class SelectAvatarComponent implements OnInit {
  public loading = false;
  public avatars: AvatarInfo[] = [];
  public defaultAvatar$: Observable<string>;
  private userId: number;

  constructor(
    private alertService: AlertService,
    private avatarService: AvatarService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    this.userId = this.sessionService.session.loggedUserId;
    this.defaultAvatar$ = this.sessionService.get(session => {
      const user = session.users[this.userId];
      return user ? user.avatarFile : '';
    });
  }

  ngOnInit() {
    this.refreshAvatars();
  }

  public getAvatarUrl(fileName: string): string {
    const config = this.sessionService.session.config;
    const avatarUrl = config && config.avatarsUrl || '';
    const apiUrl = this.apiService.getApiUrl();
    return apiUrl + avatarUrl.replace('{name}', fileName);
  }

  public selectAvatar(avatar: AvatarInfo) {
    this.loading = true;
    this.avatarService.markAsDefault(avatar.id)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/profile']);
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  private refreshAvatars(): void {
    this.loading = true;
    this.avatarService.getPredefinedAvatars()
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
} 