import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SessionService } from './shared/session/session.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './shared/alert/alert.service';
import { LoginService } from './api/services/login.service';

@Injectable({
  providedIn: 'root'
})
export class CanActivateService implements CanActivate {

  constructor(
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
      if (loggedUser.roleId === 1) {
        this.alertService.toast(this.translate.instant('ERROR_ACCOUNT_BANNED'));
        this.sessionService.clear();
        this.loginService.logout();
        return this.router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });
      }
      return true;
    }
    return this.router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });
  }
}
