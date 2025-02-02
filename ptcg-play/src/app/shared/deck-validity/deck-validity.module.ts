import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckValidityComponent } from './deck-validity.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    DeckValidityComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    DeckValidityComponent
  ]
})
export class DeckValidityModule { }
