import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../material.module';

import { TwinleafButtonComponent } from './twinleaf-button.component';

@NgModule({
  declarations: [
    TwinleafButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    TwinleafButtonComponent
  ]
})
export class TwinleafButtonModule { }
