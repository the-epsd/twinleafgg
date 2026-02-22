import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { SessionService } from './shared/session/session.service';
import { TranslateService } from '@ngx-translate/core';
import { AlertService } from './shared/alert/alert.service';
import { LoginService } from './api/services/login.service';

export const canActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const alertService = inject(AlertService);
  const translate = inject(TranslateService);
  const loginService = inject(LoginService);

  const loggedUserId = sessionService.session.loggedUserId;
  const loggedUser = loggedUserId && sessionService.session.users[loggedUserId];
  const isLoggedIn = !!loggedUser;

  if (isLoggedIn) {
    if (loggedUser!.roleId === 1) {
      alertService.toast(translate.instant('ERROR_ACCOUNT_BANNED'));
      sessionService.clear();
      loginService.logout();
      return router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });
    }
    return true;
  }
  return router.createUrlTree(['/login'], { queryParams: { redirectUrl: state.url } });
};
