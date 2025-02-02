import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LoginPopupService } from './login/login-popup/login-popup.service';
import { SessionService } from './shared/session/session.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './shared/alert/alert.service';
import { LoginService } from './api/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateService implements CanActivate {

  constructor(
    private loginPopupService: LoginPopupService,
    private sessionService: SessionService,
    private router: Router,
    private alertService: AlertService,
    private translate: TranslateService,
    private loginService: LoginService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedUserId = this.sessionService.session.loggedUserId;
    const loggedUser = loggedUserId && this.sessionService.session.users[loggedUserId];
    const isLoggedIn = !!loggedUser;

    if (isLoggedIn) {
      const bannedUsernames = ['Joacotaco24', 'leofanax', 'RedditKarmaGold', '10types'];

      const betaEndedUsernames = []; // Add usernames here

      if (bannedUsernames.includes(loggedUser.name)) {
        this.alertService.toast(this.translate.instant('User has been removed from the Beta Program for breach of Terms of Service'));
        this.sessionService.clear();
        this.loginService.logout();
        this.loginPopupService.redirectUrl = state.url;
        return this.router.parseUrl('/login');
      } else if (betaEndedUsernames.includes(loggedUser.name)) {
        this.alertService.toast(this.translate.instant('This portion of the Beta Program has ended. Thank you for your participation.'));
        this.sessionService.clear();
        this.loginService.logout();
        this.loginPopupService.redirectUrl = state.url;
        return this.router.parseUrl('/login');
      }

      return true;
    }

    this.loginPopupService.redirectUrl = state.url;
    return this.router.parseUrl('/login');
  }



}
