import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TwinleafFormComponent } from './twinleaf-form.component';

@NgModule({
  declarations: [
    TwinleafFormComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    TwinleafFormComponent
  ]
})
export class TwinleafFormModule { }
