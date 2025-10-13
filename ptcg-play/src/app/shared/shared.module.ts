import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { NgModule } from '@angular/core';
import { DndModule } from '@ng-dnd/core';
import { DndMultiBackendModule } from '@ng-dnd/multi-backend';
import { DndSortableModule } from '@ng-dnd/sortable';
import { TranslateModule } from '@ngx-translate/core';

import { AlertModule } from './alert/alert.module';
import { AppRoutingModule } from '../app-routing.module';
import { CardsModule } from './cards/cards.module';
import { ContentComponent } from './content/content.component';
import { EnergyComponent } from './cards/energy/energy.component';
import { FileInputComponent } from './file-input/file-input.component';
import { ImageCacheModule } from './image-cache/image-cache.module';
import { InfoComponent } from './info/info.component';
import { SearchBoxComponent } from './search-box/search-box.component';
import { SessionService } from './session/session.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarContainerComponent } from './sidebar/sidebar-container.component';
import { UserInfoModule } from './user-info/user-info.module';
import { ValidationModule } from './validation/validation.module';
import { ReconnectionDialogComponent } from './components/reconnection-dialog/reconnection-dialog.component';
import { ConnectionStatusComponent } from './components/connection-status/connection-status.component';
import { TwinleafPlayButtonComponent } from './twinleaf-play-button/twinleaf-play-button.component';
import { TwinleafPreviousButtonComponent } from './twinleaf-previous-button/twinleaf-previous-button.component';
import { TwinleafNextButtonComponent } from './twinleaf-next-button/twinleaf-next-button.component';
import { TwinleafButtonComponent } from './twinleaf-button/twinleaf-button.component';
import { TwinleafFormModule } from './twinleaf-form/twinleaf-form.module';

@NgModule({
  imports: [
    AlertModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
    FormsModule,
    ImageCacheModule,
    MaterialModule,
    DndMultiBackendModule,
    DndSortableModule,
    DndModule,
    TranslateModule,
    UserInfoModule,
    ValidationModule
  ],
  declarations: [
    ContentComponent,
    FileInputComponent,
    InfoComponent,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent,
    ReconnectionDialogComponent,
    ConnectionStatusComponent,
    TwinleafPlayButtonComponent,
    TwinleafPreviousButtonComponent,
    TwinleafNextButtonComponent,
    TwinleafButtonComponent
  ],
  exports: [
    AlertModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CardsModule,
    ContentComponent,
    EnergyComponent,
    FileInputComponent,
    ImageCacheModule,
    InfoComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SearchBoxComponent,
    SidebarComponent,
    SidebarContainerComponent,
    DndModule,
    DndMultiBackendModule,
    DndSortableModule,
    TranslateModule,
    UserInfoModule,
    ValidationModule,
    ReconnectionDialogComponent,
    ConnectionStatusComponent,
    TwinleafPlayButtonComponent,
    TwinleafPreviousButtonComponent,
    TwinleafNextButtonComponent,
    TwinleafButtonComponent,
    TwinleafFormModule
  ],
  providers: [
    SessionService
  ]
})
export class SharedModule { }
