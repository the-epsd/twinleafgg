import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TypeIconsComponent } from './type-icons.component';
import { MaterialModule } from '../material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    TypeIconsComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [
    TypeIconsComponent
  ]
})
export class TypeIconsModule { }
