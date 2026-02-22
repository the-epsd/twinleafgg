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
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
