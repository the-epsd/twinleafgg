import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Archetype } from 'ptcg-server';

import { ArchetypeSelectPopupComponent } from './archetype-select-popup.component';

export interface ArchetypeSelectData {
  deckId: number;
  currentArchetype1?: Archetype;
  currentArchetype2?: Archetype;
}

export interface ArchetypeSelectResult {
  archetype1: Archetype | null;
  archetype2: Archetype | null;
}

@Injectable({
  providedIn: 'root'
})
export class ArchetypeSelectPopupService {

  constructor(public dialog: MatDialog) { }

  public openDialog(data: ArchetypeSelectData): MatDialogRef<ArchetypeSelectPopupComponent, ArchetypeSelectResult | undefined> {
    const dialogRef = this.dialog.open(ArchetypeSelectPopupComponent, {
      maxWidth: '90vw',
      width: '600px',
      minWidth: '400px',
      data
    });

    return dialogRef;
  }
}

