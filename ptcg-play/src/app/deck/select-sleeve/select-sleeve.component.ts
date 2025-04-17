// ptcg-play/src/app/deck/deck-edit-toolbar/select-sleeve/select-sleeve.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ServerConfig, SleeveInfo, UserInfo } from 'ptcg-server';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs/operators';
import { ApiError } from 'src/app/api/api.error';
import { ApiService } from 'src/app/api/api.service';
import { SleeveService } from 'src/app/api/services/sleeve.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { SessionService } from 'src/app/shared/session/session.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-select-sleeve',
  templateUrl: './select-sleeve.component.html',
  styleUrls: ['./select-sleeve.component.scss']
})
export class SelectSleeveComponent implements OnInit {
  public loading = false;
  public sleeves: SleeveInfo[] = [];
  public defaultSleeve$: Observable<string>;
  private userId: number;

  constructor(
    private alertService: AlertService,
    private sleeveService: SleeveService,
    private sessionService: SessionService,
    private translate: TranslateService,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<SelectSleeveComponent>
  ) {
    this.userId = this.sessionService.session.loggedUserId;
    this.defaultSleeve$ = this.sessionService.get(session => {
      const user = session.users[this.userId] as UserInfo;
      return user ? user.sleeveFile : '';
    });
  }

  ngOnInit() {
    this.loadSleeves();
  }

  private loadSleeves() {
    this.loading = true;
    this.sleeveService.getPredefinedSleeves()
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: response => {
          console.log('Loaded sleeves:', response.sleeves);
          this.sleeves = response.sleeves;
        },
        error: (error: ApiError) => {
          console.error('Error loading sleeves:', error);
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }

  public getSleeveUrl(fileName: string): string {
    const config = this.sessionService.session.config as ServerConfig;
    const sleeveUrl = config && config.sleevesUrl || '';
    const apiUrl = this.apiService.getApiUrl();
    const url = apiUrl + sleeveUrl.replace('{name}', fileName);
    console.log('Constructed sleeve URL:', url);
    return url;
  }

  public selectSleeve(sleeve: SleeveInfo) {
    this.loading = true;
    this.sleeveService.markAsDefault(sleeve.id)
      .pipe(
        finalize(() => { this.loading = false; }),
        untilDestroyed(this)
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(sleeve);
        },
        error: (error: ApiError) => {
          if (!error.handled) {
            this.alertService.toast(this.translate.instant('ERROR_UNKNOWN'));
          }
        }
      });
  }
}