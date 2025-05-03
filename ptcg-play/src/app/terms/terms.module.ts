import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { TermsComponent } from './terms.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    TranslateModule,
    SharedModule
  ],
  exports: [TermsComponent]
})
export class TermsModule { }
