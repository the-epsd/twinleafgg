import { NgModule } from '@angular/core';

import { DeckComponent } from './deck.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SharedModule } from '../shared/shared.module';
import { DeckEditComponent } from './deck-edit/deck-edit.component';
import { DeckEditToolbarComponent } from './deck-edit-toolbar/deck-edit-toolbar.component';
import { FilterCardsPipe } from './deck-edit-toolbar/filter-cards.pipe';
import { DeckCardComponent } from './deck-card/deck-card.component';
import { DeckEditPanesComponent } from './deck-edit-panes/deck-edit-panes.component';
import { DeckEditInfoComponent } from './deck-edit-info/deck-edit-info.component';
import { ImportDeckPopupComponent } from './import-deck-popup/import-deck-popup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TypeIconsModule } from '../shared/type-icons/type-icons.module';
import { DeckCardDialogComponent } from './deck-card-dialog/deck-card-dialog.component';
import { DeckValidityModule } from '../shared/deck-validity/deck-validity.module';

@NgModule({
  imports: [
    ScrollingModule,
    FormsModule,
    ReactiveFormsModule,
    DeckValidityModule,
    SharedModule,
    TypeIconsModule
  ],
  entryComponents: [
    ImportDeckPopupComponent
  ],
  declarations: [
    DeckCardComponent,
    DeckComponent,
    DeckEditComponent,
    DeckEditToolbarComponent,
    FilterCardsPipe,
    DeckEditPanesComponent,
    DeckEditInfoComponent,
    ImportDeckPopupComponent,
    DeckCardDialogComponent
  ]
})
export class DeckModule { }
