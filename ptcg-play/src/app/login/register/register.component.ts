import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginService } from '../../api/services/login.service';

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

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService
  ) {
    this.email = `${Math.random().toString(36).substring(7)}@example.com`;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  register(): void {
    if (this.invalidName || this.invalidEmail) {
      return;
    }

    this.loading = true;
    this.loginService
      .register(this.name, this.email, this.password)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/login']);
        },
        error: () => {
          this.loading = false;
        }
      });
  }
}
