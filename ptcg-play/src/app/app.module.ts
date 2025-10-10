import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule, MultiBackend, HTML5ToTouch } from '@ng-dnd/multi-backend';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ApiModule } from './api/api.module';
import { AppComponent } from './app.component';
import { DeckModule } from './deck/deck.module';
import { FriendsModule } from './friends/friends.module';
import { GamesModule } from './games/games.module';
import { LanguageService } from './main/language-select/language.service';
import { LoginModule } from './login/login.module';
import { MainModule } from './main/main.module';
import { MessagesModule } from './messages/messages.module';
import { ProfileModule } from './profile/profile.module';
import { RankingModule } from './ranking/ranking.module';
import { ReplaysModule } from './replays/replays.module';
import { SpectateModule } from './spectate/spectate.module';
import { SharedModule } from './shared/shared.module';
import { TableModule } from './table/table.module';
import { TermsModule } from './terms/terms.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { UxStudyModule } from './ux-study/ux-study.module';
import { UiShowcaseModule } from './ui-showcase/ui-showcase.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    ApiModule,
    BrowserModule,
    DeckModule,
    FriendsModule,
    GamesModule,
    LoginModule,
    MainModule,
    MessagesModule,
    ProfileModule,
    RankingModule,
    ReplaysModule,
    SpectateModule,
    SharedModule,
    TermsModule,
    UxStudyModule,
    UiShowcaseModule,
    DndMultiBackendModule,
    DndModule.forRoot({ backend: MultiBackend, options: HTML5ToTouch }),
    TableModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(languageService: LanguageService) {
    languageService.chooseLanguage();
  }
}

// AoT requires an exported function for factories
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
