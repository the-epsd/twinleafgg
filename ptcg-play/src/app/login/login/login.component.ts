import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, switchMap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes
} from '@angular/animations';

import { ApiService } from '../../api/api.service';
import { LoginRememberService } from '../login-remember.service';
import { LoginService } from 'src/app/api/services/login.service';
import { SocketService } from '../../api/socket.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ApiError } from '../../api/api.error';
import { ApiErrorEnum } from 'ptcg-server';
import { environment } from '../../../environments/environment';
import { ChangeServerPopupComponent } from '../change-server-popup/change-server-popup.component';

@UntilDestroy()
@Component({
  selector: 'ptcg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-30px)' }),
        animate('400ms 100ms cubic-bezier(.25,.8,.25,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('formFadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('400ms 200ms cubic-bezier(.25,.8,.25,1)', style({ opacity: 1, transform: 'none' }))
      ])
    ]),
    trigger('errorShake', [
      transition(':enter', [
        animate('400ms', keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(-10px)', offset: 0.2 }),
          style({ transform: 'translateX(10px)', offset: 0.4 }),
          style({ transform: 'translateX(-10px)', offset: 0.6 }),
          style({ transform: 'translateX(10px)', offset: 0.8 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit, OnDestroy {
  public loading = false;
  public initialLoading = true;
  public name: string;
  public password: string;
  public rememberMe = true;
  public allowServerChange = environment.allowServerChange;
  public errorMessage: string | null = null;
  private loginAborted$ = new Subject<void>();
  private redirectUrl: string;

  constructor(
    private apiService: ApiService,
    private loginRememberService: LoginRememberService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private alertService: AlertService,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.redirectUrl = this.route.snapshot.queryParams['returnUrl'] || '/games';
  }

  ngOnInit() {
    const apiUrl = this.loginRememberService.apiUrl;
    if (apiUrl && this.apiService.getApiUrl() !== apiUrl) {
      this.apiService.setApiUrl(apiUrl);
      this.socketService.setServerUrl(apiUrl);
    }

    const token = this.loginRememberService.token;
    if (token) {
      timer(1000).pipe(
        switchMap(() => this.loginService.tokenLogin(token, this.loginAborted$)),
        untilDestroyed(this),
        finalize(() => {
          this.loading = false;
          this.initialLoading = false;
        })
      ).subscribe({
        next: response => {
          this.loginRememberService.rememberToken(response.token);
          this.router.navigate([this.redirectUrl]);
        },
        error: () => {
          this.loginRememberService.rememberToken();
        }
      });
    } else {
      this.initialLoading = false;
    }
  }

  login() {
    this.loading = true;
    this.errorMessage = null;
    timer(1000).pipe(
      switchMap(() => this.loginService.login(this.name, this.password, this.loginAborted$)),
      untilDestroyed(this),
      finalize(() => { this.loading = false; })
    ).subscribe({
      next: response => {
        if (this.rememberMe) {
          this.loginRememberService.rememberToken(response.token);
        }
        this.errorMessage = null;
        this.router.navigate([this.redirectUrl]);
      },
      error: (error: ApiError) => {
        switch (error.code) {
          case ApiErrorEnum.LOGIN_INVALID:
            this.errorMessage = this.translate.instant('ERROR_INVALID_NAME_OR_PASSWORD');
            break;
          case ApiErrorEnum.USER_BANNED:
            this.errorMessage = this.translate.instant('ERROR_ACCOUNT_BANNED');
            break;
          case ApiErrorEnum.UNSUPPORTED_VERSION:
            this.errorMessage = this.translate.instant('ERROR_UNSUPPORTED_VERSION');
            break;
          default:
            this.errorMessage = this.translate.instant('ERROR_UNKNOWN');
        }
      }
    });
  }

  changeServer() {
    this.dialog.open(ChangeServerPopupComponent, {
      width: '450px',
      maxWidth: '100%'
    });
  }

  resetPassword() {
    this.router.navigate(['/reset-password']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  ngOnDestroy() {
    this.loginAborted$.next();
    this.loginAborted$.complete();
  }
}
