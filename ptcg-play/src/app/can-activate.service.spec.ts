import { TestBed } from '@angular/core/testing';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { canActivateGuard } from './can-activate.service';
import { SessionService } from './shared/session/session.service';
import { AlertService } from './shared/alert/alert.service';
import { LoginService } from './api/services/login.service';

describe('canActivateGuard', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      MatDialogModule,
      RouterTestingModule,
      TranslateModule.forRoot()
    ],
    providers: [
      { provide: AlertService, useValue: { toast: () => {} } },
      { provide: LoginService, useValue: { logout: () => {} } }
    ]
  }));

  it('should redirect to login when not logged in', () => {
    const result = TestBed.runInInjectionContext(() =>
      canActivateGuard(
        {} as any,
        { url: '/test' } as RouterStateSnapshot
      )
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toContain('/login');
  });

  it('should allow access when logged in', () => {
    const sessionService = TestBed.inject(SessionService);
    sessionService.set({
      authToken: 'token',
      loggedUserId: 2,
      users: { 2: { roleId: 2 } as any }
    });

    const result = TestBed.runInInjectionContext(() =>
      canActivateGuard(
        {} as any,
        { url: '/test' } as RouterStateSnapshot
      )
    );

    expect(result).toBe(true);
  });
});
