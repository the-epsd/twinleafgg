import { NgModule } from '@angular/core';

import { GamesModule } from '../games/games.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';
import { AddAvatarPopupComponent } from './add-avatar-popup/add-avatar-popup.component';
import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangePasswordPopupComponent } from './change-password-popup/change-password-popup.component';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ChangeCardImagesPopupComponent } from './change-card-images-popup/change-card-images-popup.component';

@NgModule({
  imports: [
    SharedModule,
    GamesModule,
    MatDialogModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
        deps: [HttpClient]
      }
    })
  ],
  declarations: [
    AddAvatarPopupComponent,
    ChangeEmailPopupComponent,
    ChangeCardImagesPopupComponent,
    ChangePasswordPopupComponent,
    EditAvatarsPopupComponent,
    ProfileComponent
  ],
  entryComponents: [
    AddAvatarPopupComponent,
    ChangeEmailPopupComponent,
    ChangeCardImagesPopupComponent,
    ChangePasswordPopupComponent,
    EditAvatarsPopupComponent
  ],
  exports: [
  ]
}) export class ProfileModule { }
