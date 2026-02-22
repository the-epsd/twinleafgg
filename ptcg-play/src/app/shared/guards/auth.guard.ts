import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../session/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const isAuthenticated = !!sessionService.session.authToken;

  if (isAuthenticated) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
  return false;
};
