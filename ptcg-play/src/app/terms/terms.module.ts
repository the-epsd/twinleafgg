import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { TermsComponent } from './terms.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { ContentComponent } from '../shared/content/content.component';

@NgModule({
  declarations: [TermsComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [TermsComponent]
})
export class TermsModule { }
