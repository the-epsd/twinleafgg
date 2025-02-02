import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { NewsComponent } from './news.component';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NewsComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    SharedModule,
    TranslateModule
  ],
  exports: [NewsComponent]
})
export class NewsModule { }
