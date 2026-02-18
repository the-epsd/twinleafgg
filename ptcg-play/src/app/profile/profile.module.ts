import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { EditAvatarsPopupComponent } from './edit-avatars-popup/edit-avatars-popup.component';
import { ChangeEmailPopupComponent } from './change-email-popup/change-email-popup.component';
import { ChangePasswordPopupComponent } from './change-password-popup/change-password-popup.component';
import { ChangeCardImagesPopupComponent } from './change-card-images-popup/change-card-images-popup.component';
import { SelectAvatarComponent } from './select-avatar/select-avatar.component';
import { GamesModule } from '../games/games.module';

@NgModule({
    imports: [
        SharedModule,
        GamesModule,
        MatDialogModule,
        MatTableModule,
        MatRadioModule,
        MatButtonModule,
        MatProgressBarModule,
        MatToolbarModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (http: HttpClient) => new TranslateHttpLoader(http),
                deps: [HttpClient]
            }
        })
    ],
    declarations: [
        ChangeEmailPopupComponent,
        ChangeCardImagesPopupComponent,
        ChangePasswordPopupComponent,
        EditAvatarsPopupComponent,
        ProfileComponent,
        SelectAvatarComponent
    ],
    exports: []
}) export class ProfileModule { }
