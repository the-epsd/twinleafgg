import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginService } from '../../api/services/login.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ServerPasswordPopupService } from '../server-password-popup/server-password-popup.service';

@UntilDestroy()
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  public name = '';
  public email = '';
  public password = '';
  public loading = false;
  public invalidName: string | null = null;
  public invalidEmail: string | null = null;
  public invalidPassword: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly alertService: AlertService,
    private readonly serverPasswordPopupService: ServerPasswordPopupService
  ) {
    this.email = `${Math.random().toString(36).substring(7)}@example.com`;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  register(code?: string): void {
    // Validate name (3-32 alphanumeric characters)
    if (!/^[a-zA-Z0-9]{3,32}$/.test(this.name)) {
      this.invalidName = 'Name must be 3-32 alphanumeric characters';
      return;
    }

    // Validate email
    if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(this.email)) {
      this.invalidEmail = 'Invalid email format';
      return;
    }

    // Validate password (5-32 non-whitespace characters)
    if (!/^[^\s]{5,32}$/.test(this.password)) {
      this.invalidPassword = 'Password must be 5-32 non-whitespace characters';
      return;
    }

    this.loading = true;
    this.loginService
      .register(this.name, this.password, this.email, code)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.loading = false;
          this.alertService.toast('Account created successfully');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          if (error.error === 'ERROR_NAME_EXISTS') {
            this.invalidName = 'Username already exists';
          } else if (error.error === 'ERROR_EMAIL_EXISTS') {
            this.invalidEmail = 'Email already exists';
          } else if (error.error === 'ERROR_REGISTER_DISABLED') {
            this.alertService.error('Registration is currently disabled');
          } else if (error.error === 'ERROR_REGISTER_INVALID_SERVER_PASSWORD') {
            this.serverPasswordPopupService.openDialog()
              .pipe(untilDestroyed(this))
              .subscribe(code => {
                if (code !== undefined) {
                  this.register(code);
                }
              });
          }
        }
      });
  }
}
