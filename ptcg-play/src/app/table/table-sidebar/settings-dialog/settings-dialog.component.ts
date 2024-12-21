import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { SettingsService } from "./settings.service";

@Component({
  selector: 'ptcg-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  holoEnabled = true;
  showCardName = false;
  cardSize = 100;

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private settingsService: SettingsService
  ) {
    this.settingsService.holoEnabled$.subscribe(
      enabled => this.holoEnabled = enabled
    );
    this.settingsService.showCardName$.subscribe(
      enabled => this.showCardName = enabled
    );
    this.settingsService.cardSize$.subscribe(size => this.cardSize = size);
  }

  onCardSizeChange(event: Event) {
    const size = (event.target as HTMLInputElement).value;
    this.settingsService.setCardSize(parseInt(size));
  }

  save() {
    this.settingsService.setHoloEnabled(this.holoEnabled);
    this.settingsService.setShowCardName(this.showCardName);  // Add this line
    this.settingsService.setCardSize(this.cardSize);
    this.dialogRef.close();
  }
}


@NgModule({
  imports: [
    FormsModule,
    MatDialogModule,
    CommonModule
  ],
  declarations: [SettingsDialogComponent],
  exports: [SettingsDialogComponent]
})
export class SettingsDialogModule { }