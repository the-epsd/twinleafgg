import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DeckComponent } from './deck.component';
import { SharedModule } from '../shared/shared.module';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { DeckEditToolbarComponent } from './deck-edit-toolbar/deck-edit-toolbar.component';
import { DeckCardComponent } from './deck-card/deck-card.component';
import { DeckEditPanesComponent } from './deck-edit-panes/deck-edit-panes.component';
import { DeckEditInfoComponent } from './deck-edit-info/deck-edit-info.component';
import { ImportDeckPopupComponent } from './import-deck-popup/import-deck-popup.component';
import { TypeIconsModule } from '../shared/type-icons/type-icons.module';
import { DeckCardDialogComponent } from './deck-card-dialog/deck-card-dialog.component';
import { DeckValidityModule } from '../shared/deck-validity/deck-validity.module';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    DeckValidityModule,
    SharedModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    TypeIconsModule,
    RouterModule,
    // Standalone components
    DeckEditToolbarComponent,
    DeckEditPanesComponent,
    DeckCardComponent,
    DeckCardDialogComponent
  ],
  declarations: [
    DeckComponent,
    DeckEditComponent,
    DeckEditInfoComponent,
    ImportDeckPopupComponent
  ],
  exports: [
    DeckComponent
  ]
})
export class DeckModule { }
