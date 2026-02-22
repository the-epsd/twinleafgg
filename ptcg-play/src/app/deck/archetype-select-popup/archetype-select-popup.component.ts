import { Component, Inject, OnInit } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Archetype } from 'ptcg-server';

import { ArchetypeSelectData, ArchetypeSelectResult } from './archetype-select-popup.service';

@Component({
  selector: 'ptcg-archetype-select-popup',
  templateUrl: './archetype-select-popup.component.html',
  styleUrls: ['./archetype-select-popup.component.scss']
})
export class ArchetypeSelectPopupComponent implements OnInit {

  public archetypes: { value: Archetype; label: string }[] = [];
  public filteredArchetypes: { value: Archetype; label: string }[] = [];
  public searchText: string = '';
  public selectedArchetype1: Archetype | null = null;
  public selectedArchetype2: Archetype | null = null;

  constructor(
    private dialogRef: MatDialogRef<ArchetypeSelectPopupComponent, ArchetypeSelectResult | undefined>,
    @Inject(MAT_DIALOG_DATA) public data: ArchetypeSelectData
  ) {
    // Initialize archetypes list - alphabetically sorted
    this.archetypes = Object.values(Archetype)
      .filter(value => typeof value === 'string')
      .map(value => ({
        value: value as Archetype,
        label: value.toString().toLowerCase().replace(/_/g, ' ')
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    this.filteredArchetypes = this.archetypes;

    // Set initial selections
    this.selectedArchetype1 = data.currentArchetype1 || null;
    this.selectedArchetype2 = data.currentArchetype2 || null;
  }

  ngOnInit(): void {
  }

  public onSearch(searchText: string) {
    this.searchText = searchText;
    if (!searchText) {
      this.filteredArchetypes = this.archetypes;
      return;
    }
    const searchLower = searchText.toLowerCase();
    this.filteredArchetypes = this.archetypes.filter(archetype =>
      archetype.label.includes(searchLower)
    );
  }

  public selectArchetype1(archetype: Archetype | null | undefined) {
    // Convert undefined to null for consistency
    this.selectedArchetype1 = archetype === undefined ? null : archetype;
  }

  public selectArchetype2(archetype: Archetype | null | undefined) {
    // Convert undefined to null for consistency
    this.selectedArchetype2 = archetype === undefined ? null : archetype;
  }

  public isSelected1(archetype: Archetype | null | undefined): boolean {
    const normalizedArchetype = archetype === undefined ? null : archetype;
    return this.selectedArchetype1 === normalizedArchetype;
  }

  public isSelected2(archetype: Archetype | null | undefined): boolean {
    const normalizedArchetype = archetype === undefined ? null : archetype;
    return this.selectedArchetype2 === normalizedArchetype;
  }

  public save() {
    this.dialogRef.close({
      archetype1: this.selectedArchetype1,
      archetype2: this.selectedArchetype2
    });
  }

  public cancel() {
    this.dialogRef.close();
  }
}

