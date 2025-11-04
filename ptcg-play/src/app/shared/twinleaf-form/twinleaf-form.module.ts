import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TwinleafFormComponent } from './twinleaf-form.component';

@NgModule({
  declarations: [
    TwinleafFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    TwinleafFormComponent
  ]
})
export class TwinleafFormModule { }
