import { Component, OnInit, HostListener, ElementRef, OnDestroy } from '@angular/core';

import { UserInfo } from 'ptcg-server';
import { Observable, interval } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { switchMap, filter, take } from 'rxjs/operators';

import { AlertService } from './shared/alert/alert.service';
import { LoginRememberService } from './login/login-remember.service';
import { LoginService } from './api/services/login.service';
import { SessionService } from './shared/session/session.service';
import { SocketService } from './api/socket.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@UntilDestroy()
@Component({
  selector: 'ptcg-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public isLoggedIn = false;
  public loggedUser: UserInfo | undefined;
  private authToken$: Observable<string>;
  public showToolbar = true;
  private reconnectTimer: any;
  private reconnectSnackRef: any;

  constructor(
    private alertService: AlertService,
    private dialog: MatDialog,
    private elementRef: ElementRef<HTMLElement>,
    private loginService: LoginService,
    private loginRememberService: LoginRememberService,
    private router: Router,
    private sessionService: SessionService,
    private socketService: SocketService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.authToken$ = this.sessionService.get(session => session.authToken);
    setTimeout(() => this.onResize());
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.showToolbar = !event.urlAfterRedirects.startsWith('/maintenance');
      }
    });
  }

  public ngOnInit() {
    this.authToken$
      .pipe(untilDestroyed(this))
      .subscribe(authToken => {
        this.isLoggedIn = !!authToken;
        if (this.isLoggedIn && !this.socketService.isEnabled) {
          this.socketService.enable(authToken);
        }
        if (!this.isLoggedIn && this.socketService.isEnabled) {
          this.socketService.disable();
        }
      });

    this.socketService.connection.pipe(
      untilDestroyed(this)
    ).subscribe({
      next: connected => {
        if (!this.isLoggedIn) { return; }

        if (!connected) {
          // Show a reconnecting snackbar and give time for auto-reconnect
          if (!this.reconnectSnackRef) {
            this.reconnectSnackRef = this.snackBar.open(
              this.translate.instant('RECONNECTING_TO_SERVER'),
              undefined,
              { duration: undefined, panelClass: 'disconnect-snackbar' }
            );
          }
          if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => {
              // Consider it a hard disconnect after grace period
              this.dialog.closeAll();
              if (this.reconnectSnackRef) { this.reconnectSnackRef.dismiss(); this.reconnectSnackRef = null; }
              this.sessionService.clear();
              this.router.navigate(['/login']);
            }, 90 * 1000); // 90s grace period for reconnection
          }
          return;
        }

        // Connected again: clear UI and timers
        if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
        if (this.reconnectSnackRef) { this.reconnectSnackRef.dismiss(); this.reconnectSnackRef = null; }
      }
    });

    interval(environment.refreshTokenInterval).pipe(
      untilDestroyed(this),
      filter(() => !!this.sessionService.session.authToken),
      switchMap(() => this.loginService.refreshToken())
    ).subscribe({
      next: response => {
        this.sessionService.session.authToken = response.token;
        if (this.loginRememberService.token) {
          this.loginRememberService.rememberToken(response.token);
        }
        // Ensure future reconnects use the refreshed token
        try {
          (this.socketService.socket.io.opts.query as any).token = response.token;
        } catch { /* noop */ }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const element = this.elementRef.nativeElement;
    const toolbarHeight = 64;
    const contentHeight = element.offsetHeight - toolbarHeight;
    const cardAspectRatio = 1.37;
    const padding = 16;
    const cardHeight = (contentHeight - (padding * 5)) / 7;
    let cardSize = Math.floor(cardHeight / cardAspectRatio);
    cardSize = Math.min(Math.max(cardSize, 60), 60);
    element.style.setProperty('--card-size', cardSize + 'px');
  }

  ngOnDestroy() {
    this.socketService.disable();
  }
}