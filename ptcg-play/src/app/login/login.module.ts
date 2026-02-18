import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ServerPasswordPopupComponent } from './server-password-popup/server-password-popup.component';
import { ServerPasswordPopupService } from './server-password-popup/server-password-popup.service';
import { ChangeServerPopupComponent } from './change-server-popup/change-server-popup.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'set-new-password', component: SetNewPasswordComponent }
];

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ChangeServerPopupComponent,
        RegisterComponent,
        ResetPasswordComponent,
        ServerPasswordPopupComponent,
        SetNewPasswordComponent,
        LoginComponent
    ],
    providers: [
        ServerPasswordPopupService
    ],
    exports: [
        RegisterComponent,
        ResetPasswordComponent
    ]
})
export class LoginModule { }
