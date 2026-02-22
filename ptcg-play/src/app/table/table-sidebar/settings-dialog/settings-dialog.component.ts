import { CommonModule } from "@angular/common";
import { Component, NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";
import { TranslateModule } from "@ngx-translate/core";
import { SettingsService } from "./settings.service";
import { Format } from "ptcg-server";
import { Board3dAccessService } from "../../../shared/services/board3d-access.service";

@Component({
  selector: 'ptcg-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent {
  holoEnabled = true;
  showCardName = false;
  showTags = false;
  cardSize = 100;
  hiddenFormats: Format[] = [];
  use3dBoardDefault = false;
  has3dBoardAccess = false;
  cardTextKerning = 0;
  sfxEnabled = true;
  sfxVolume = 70; // Display as percentage (0-100), stored as 0.0-1.0 internally

  // Available formats for selection
  public Format = Format;
  public availableFormats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'LABEL_STANDARD_NIGHTLY' },
    { value: Format.STANDARD_MAJORS, label: 'LABEL_STANDARD_MAJORS' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    { value: Format.ETERNAL, label: 'LABEL_ETERNAL' },
    { value: Format.SWSH, label: 'LABEL_SWSH' },
    { value: Format.SM, label: 'LABEL_SM' },
    { value: Format.XY, label: 'LABEL_XY' },
    { value: Format.BW, label: 'LABEL_BW' },
    { value: Format.RSPK, label: 'LABEL_RSPK' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.THEME, label: 'FORMAT_THEME' },
  ];

  constructor(
    public dialogRef: MatDialogRef<SettingsDialogComponent>,
    private settingsService: SettingsService,
    private board3dAccessService: Board3dAccessService
  ) {
    this.settingsService.holoEnabled$.subscribe(
      enabled => this.holoEnabled = enabled
    );
    this.settingsService.showCardName$.subscribe(
      enabled => this.showCardName = enabled
    );
    this.settingsService.showTags$.subscribe(
      enabled => this.showTags = enabled
    );
    this.settingsService.cardSize$.subscribe(size => this.cardSize = size);
    this.settingsService.hiddenFormats$.subscribe(
      formats => this.hiddenFormats = formats
    );
    this.settingsService.use3dBoardDefault$.subscribe(
      enabled => this.use3dBoardDefault = enabled
    );
    this.settingsService.cardTextKerning$.subscribe(
      kerning => this.cardTextKerning = kerning
    );
    this.settingsService.sfxEnabled$.subscribe(
      enabled => this.sfxEnabled = enabled
    );
    this.settingsService.sfxVolume$.subscribe(
      volume => this.sfxVolume = Math.round(volume * 100) // Convert 0.0-1.0 to 0-100 for display
    );
    this.board3dAccessService.has3dBoardAccess$.subscribe(
      hasAccess => this.has3dBoardAccess = hasAccess
    );
  }

  onCardSizeChange(event: Event) {
    const size = (event.target as HTMLInputElement).value;
    this.settingsService.setCardSize(parseInt(size));
  }

  onCardTextKerningChange(event: Event) {
    const kerning = (event.target as HTMLInputElement).value;
    this.settingsService.setCardTextKerning(parseFloat(kerning));
  }

  onSfxVolumeChange(event: Event) {
    const volumePercent = parseInt((event.target as HTMLInputElement).value);
    const volume = volumePercent / 100; // Convert 0-100 to 0.0-1.0
    this.settingsService.setSfxVolume(volume);
  }

  onHiddenFormatsChange(format: Format, isHidden: boolean) {
    if (isHidden) {
      if (!this.hiddenFormats.includes(format)) {
        this.hiddenFormats = [...this.hiddenFormats, format];
      }
    } else {
      this.hiddenFormats = this.hiddenFormats.filter(f => f !== format);
    }
  }

  isFormatHidden(format: Format): boolean {
    return this.hiddenFormats.includes(format);
  }

  save() {
    this.settingsService.setHoloEnabled(this.holoEnabled);
    this.settingsService.setShowCardName(this.showCardName);
    this.settingsService.setShowTags(this.showTags);
    this.settingsService.setCardSize(this.cardSize);
    this.settingsService.setHiddenFormats(this.hiddenFormats);
    this.settingsService.setUse3dBoardDefault(this.use3dBoardDefault);
    this.settingsService.setCardTextKerning(this.cardTextKerning);
    this.settingsService.setSfxEnabled(this.sfxEnabled);
    this.settingsService.setSfxVolume(this.sfxVolume / 100); // Convert percentage to 0.0-1.0
    this.dialogRef.close();
  }
}

@NgModule({
  imports: [
    FormsModule,
    MatDialogModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [SettingsDialogComponent],
  exports: [SettingsDialogComponent]
})
export class SettingsDialogModule { }