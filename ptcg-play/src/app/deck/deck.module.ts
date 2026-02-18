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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { ArchetypeSelectPopupComponent } from './archetype-select-popup/archetype-select-popup.component';
import { DeckStatsComponent } from './deck-stats/deck-stats.component';
import { SleeveSelectPopupComponent } from './sleeve-select-popup/sleeve-select-popup.component';

@NgModule({
    imports: [
        ScrollingModule,
        FormsModule,
        ReactiveFormsModule,
        DeckValidityModule,
        SharedModule,
        TypeIconsModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatTableModule
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
        DeckCardDialogComponent,
        ArchetypeSelectPopupComponent,
        DeckStatsComponent,
        SleeveSelectPopupComponent
    ]
})
export class DeckModule { }
