import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  trigger,
  transition,
  style,
  animate,
  keyframes
} from '@angular/animations';
import { TranslateService } from '@ngx-translate/core';
import { LoginService } from '../../api/services/login.service';
import { AlertService } from '../../shared/alert/alert.service';
import { ServerPasswordPopupService } from '../server-password-popup/server-password-popup.service';
import { TwinleafFormField } from '../../shared/twinleaf-form/twinleaf-form.component';

// Validator functions for reactive forms
function playerNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value || '');
    if (!value.match(/^[a-zA-Z0-9]{3,32}$/)) {
      return { name: true };
    }
    return null;
  };
}

function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value || '');
    // Password must not contain white space characters
    if (value.match(/\s/) !== null) {
      return { password: true };
    }
    if (value.length < 5 || value.length > 32) {
      return { password: true };
    }
    return null;
  };
}

function passwordMatchValidator(passwordControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value || '');
    if (value !== String(passwordControl.value || '')) {
      return { passwordMatch: true };
    }
    return null;
  };
}

@UntilDestroy()
@Component({
  selector: 'ptcg-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
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
export class RegisterComponent implements OnInit {
  public loading = false;
  public logoLoaded = false;
  public email = '';
  public errorMessage: string | null = null;
  public invalidName: string | null = null;

  // Form fields for twinleaf-form
  registerFormFields: TwinleafFormField[] = [];

  constructor(
    private readonly router: Router,
    private readonly loginService: LoginService,
    private readonly alertService: AlertService,
    private readonly serverPasswordPopupService: ServerPasswordPopupService,
    private readonly translate: TranslateService
  ) {
    this.email = `${Math.random().toString(36).substring(7)}@example.com`;
  }

  ngOnInit(): void {
    // Initialize form fields
    // Note: Password match validation is handled in onFormSubmit since we need access to both fields
    this.registerFormFields = [
      {
        name: 'name',
        label: 'REGISTER_NAME',
        type: 'text',
        placeholder: 'REGISTER_NAME',
        required: true,
        validation: Validators.compose([Validators.required, playerNameValidator()]),
        hint: 'REGISTER_NAME_HINT'
      },
      {
        name: 'password',
        label: 'REGISTER_PASSWORD',
        type: 'password',
        placeholder: 'REGISTER_PASSWORD',
        required: true,
        validation: Validators.compose([Validators.required, passwordValidator()]),
        hint: 'REGISTER_PASSWORD_HINT'
      },
      {
        name: 'confirmPassword',
        label: 'REGISTER_PASSWORD_CONFIRM',
        type: 'password',
        placeholder: 'REGISTER_PASSWORD_CONFIRM',
        required: true,
        validation: Validators.required,
        hint: 'REGISTER_PASSWORD_CONFIRM_HINT'
      }
    ];
  }

  onFormSubmit(formData: any): void {
    this.errorMessage = null;
    this.invalidName = null;

    // Validate password match manually since we need access to both fields
    if (formData.password !== formData.confirmPassword) {
      this.errorMessage = this.translate.instant('VALIDATION_PASSWORD_MATCH');
      return;
    }

    this.register(formData.name, formData.password, formData.confirmPassword);
  }

  onFormChange(formData: any): void {
    // Clear errors when form changes
    if (this.errorMessage || this.invalidName) {
      this.errorMessage = null;
      this.invalidName = null;
    }
  }

  register(name: string, password: string, confirmPassword: string, code?: string): void {
    // Password match validation (already done in onFormSubmit, but double-check)
    if (password !== confirmPassword) {
      this.errorMessage = this.translate.instant('VALIDATION_PASSWORD_MATCH');
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.invalidName = null;

    this.loginService
      .register(name, password, this.email, code)
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
            this.errorMessage = this.translate.instant('REGISTER_NAME_TAKEN');
          } else if (error.error === 'ERROR_EMAIL_EXISTS') {
            this.errorMessage = 'Email already exists';
          } else if (error.error === 'ERROR_REGISTER_DISABLED') {
            this.errorMessage = 'Registration is currently disabled';
            this.alertService.error('Registration is currently disabled');
          } else if (error.error === 'ERROR_REGISTER_INVALID_SERVER_PASSWORD') {
            this.serverPasswordPopupService.openDialog()
              .pipe(untilDestroyed(this))
              .subscribe(serverCode => {
                if (serverCode !== undefined) {
                  this.register(name, password, confirmPassword, serverCode);
                }
              });
          } else {
            this.errorMessage = this.translate.instant('ERROR_UNKNOWN');
          }
        }
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  onLogoLoad(): void {
    this.logoLoaded = true;
  }

  onLogoError(): void {
    this.logoLoaded = true; // Still show the container even if image fails
  }
}
