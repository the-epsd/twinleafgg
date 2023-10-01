import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CardTag, CardType, Format, SuperType } from 'ptcg-server';
import { MatSelectChange } from '@angular/material/select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Deck } from '../../api/interfaces/deck.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { ImportDeckPopupService } from '../import-deck-popup/import-deck-popup.service';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit-toolbar',
  templateUrl: './deck-edit-toolbar.component.html',
  styleUrls: ['./deck-edit-toolbar.component.scss']
})
export class DeckEditToolbarComponent {

  @Input() deck: Deck;

  @Input() disabled: boolean;

  @Output() filterChange = new EventEmitter<DeckEditToolbarFilter>();

  @Output() save = new EventEmitter<void>();

  @Output() import = new EventEmitter<string[]>();

  @Output() export = new EventEmitter<void>();

  public cardTypes = [
    {value: CardType.NONE, label: 'LABEL_NONE' },
    {value: CardType.COLORLESS, label: 'LABEL_COLORLESS' },
    {value: CardType.GRASS, label: 'LABEL_GRASS' },
    {value: CardType.FIGHTING, label: 'LABEL_FIGHTING' },
    {value: CardType.PSYCHIC, label: 'LABEL_PSYCHIC' },
    {value: CardType.WATER, label: 'LABEL_WATER' },
    {value: CardType.LIGHTNING, label: 'LABEL_LIGHTNING' },
    {value: CardType.METAL, label: 'LABEL_METAL' },
    {value: CardType.DARK, label: 'LABEL_DARK' },
    {value: CardType.FIRE, label: 'LABEL_FIRE' },
    {value: CardType.DRAGON, label: 'LABEL_DRAGON' },
    {value: CardType.FAIRY, label: 'LABEL_FAIRY' },
  ];

  public superTypes = [
    {value: SuperType.POKEMON, label: 'LABEL_POKEMON' },
    {value: SuperType.TRAINER, label: 'LABEL_TRAINER' },
    {value: SuperType.ENERGY, label: 'LABEL_ENERGY' },
  ];

  public formats = [
    {value: Format.STANDARD, label: 'LABEL_STANDARD' },
    {value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    {value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    {value: Format.RETRO, label: 'LABEL_RETRO' },
  ];

  public cardTags = [
    {value: CardTag.POKEMON_V, label: 'Pokemon V' },
    {value: CardTag.POKEMON_VSTAR, label: 'Pokemon VSTAR' },
    {value: CardTag.POKEMON_VMAX, label: 'Pokemon VMAX' },
  ];

  public filterValue: DeckEditToolbarFilter;

  constructor(
    private importDeckPopupService: ImportDeckPopupService
  ) {
    this.filterValue = {
      searchValue: '',
      superTypes: [],
      cardTypes: [],
      formats: [],
      tags: [],
    };
  }

  public onSave() {
    this.save.next();
  }

  public onSearch(value: string) {
    this.filterValue.searchValue = value;
    this.filterChange.next({...this.filterValue});
  }

  public onSuperTypeChange(change: MatSelectChange) {
    this.filterValue.superTypes = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public onCardTypeChange(change: MatSelectChange) {
    this.filterValue.cardTypes = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public onFormatChange(change: MatSelectChange) {
    this.filterValue.formats = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public onTagChange(change: MatSelectChange) {
    this.filterValue.tags = change.value;
    this.filterChange.next({...this.filterValue});
  }

  public importFromClipboard() {

    // Read clipboard text
    navigator.clipboard.readText()
      .then(text => {
  
        // Parse text into card names  
        const cardNames = text.split('\n')
          .map(line => line.trim())
          .filter(line => !!line);
        
        // Import card names
        this.import.next(cardNames);
  
      });
  
  }
  

  public exportToFile() {
    this.export.next();
  }

}
                                