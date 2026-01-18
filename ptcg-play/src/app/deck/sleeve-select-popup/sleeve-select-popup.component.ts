import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SleeveInfo } from '../../api/interfaces/sleeve.interface';

export interface SleeveSelectPopupData {
  sleeves: SleeveInfo[];
  selectedIdentifier?: string;
}

@Component({
  selector: 'ptcg-sleeve-select-popup',
  templateUrl: './sleeve-select-popup.component.html',
  styleUrls: ['./sleeve-select-popup.component.scss']
})
export class SleeveSelectPopupComponent {

  constructor(
    private dialogRef: MatDialogRef<SleeveSelectPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SleeveSelectPopupData
  ) { }

  public selectSleeve(identifier?: string) {
    this.dialogRef.close(identifier);
  }
}
