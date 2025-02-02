import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from "@ngx-translate/core";
import { AlertService } from "src/app/shared/alert/alert.service";
import { CardsBaseService } from "src/app/shared/cards/cards-base.service";

@Component({
  selector: 'ptcg-change-card-images-popup',
  templateUrl: './change-card-images-popup.component.html',
  styleUrls: ['./change-card-images-popup.component.scss']
})
export class ChangeCardImagesPopupComponent {
  public jsonUrl: string;

  constructor(
    private dialogRef: MatDialogRef<ChangeCardImagesPopupComponent>,
    @Inject(MAT_DIALOG_DATA) data: { userId: number },
    private cardImageService: CardsBaseService,
    private alertService: AlertService,
    private translate: TranslateService
  ) { }

  resetCardImages(): void {
    this.cardImageService.setScanUrl('https://gist.githubusercontent.com/RawrJoey/b13aace5fba9f5568039f00c69492617/raw/2df7ea74c8b68d64ca74aa201f976611471b811e/reset.json').subscribe({
      next: () => {
        this.dialogRef.close();
        this.alertService.toast(this.translate.instant('PROFILE_RESET_CARD_IMAGES_SUCCESS'));
      },
      error: (error) => {
        this.alertService.toast(this.translate.instant('PROFILE_RESET_CARD_IMAGES_ERROR', { message: 'Reset failed' }));
      }
    });
  }


  changeCardImages(): void {
    this.cardImageService.setScanUrl(this.jsonUrl).subscribe({
      next: () => {
        this.dialogRef.close();
        this.alertService.toast(this.translate.instant('PROFILE_CHANGE_CARD_IMAGES_SUCCESS'));
      },
      error: (error) => {
        this.alertService.toast(this.translate.instant('PROFILE_CHANGE_CARD_IMAGES_ERROR', { message: 'Did not work' }));
      }
    });
  }
}
