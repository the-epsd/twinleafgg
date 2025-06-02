import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaintenanceMessageComponent } from './maintenance-message.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [MaintenanceMessageComponent],
  imports: [CommonModule, MatIconModule],
  exports: [MaintenanceMessageComponent]
})
export class MaintenanceModule { } 