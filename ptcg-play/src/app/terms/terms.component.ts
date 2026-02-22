import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatToolbar } from '@angular/material/toolbar';

@Component({
  selector: 'ptcg-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent {

  constructor(private dialog: MatDialog) { }
}
