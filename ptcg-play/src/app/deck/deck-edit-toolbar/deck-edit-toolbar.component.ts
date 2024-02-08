import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Deck } from '../../api/interfaces/deck.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { ControlContainer, FormBuilder, FormGroupDirective } from '@angular/forms';
import { map, startWith, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CardTag, CardType, Format, Stage, SuperType } from 'ptcg-server';

@UntilDestroy()
@Component({
  selector: 'ptcg-deck-edit-toolbar',
  templateUrl: './deck-edit-toolbar.component.html',
  styleUrls: ['./deck-edit-toolbar.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class DeckEditToolbarComponent implements OnDestroy {

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
  
  public stages = [
    {value: Stage.BASIC, label: 'CARDS_BASIC' },
    {value: Stage.STAGE_1, label: 'CARDS_STAGE_1' },
    {value: Stage.STAGE_2, label: 'CARDS_STAGE_2' }
  ];

  public formats = [
    {value: Format.STANDARD, label: 'LABEL_STANDARD' },
    {value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    {value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
    {value: Format.RETRO, label: 'LABEL_RETRO' },
  ];

  public cardTags = Object.keys(CardTag).map(key => 
    ({value: CardTag[key], label: `LABEL_${key}`})
  );
  
  initialFormValue = {
    formats: [[]],
    cardTypes: [[0]],
    superTypes: [[]],
    tags: [[]],
    stages: [[]],
    searchValue: null
  };  
  
  form = this.formBuilder.group({ ...this.initialFormValue });
  
  formValue$ = this.form.valueChanges.pipe(
    startWith(this.initialFormValue)
  );
  
  showPokemonSearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(1))
  );
  
  showTrainerSearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(2))
  );
  
  showEnergySearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(3))
  );
  
  onFormChange$ = this.formValue$.pipe(
    tap(value => this.filterChange.emit({ ...value }))
  );
  
  subscription = merge(
    this.onFormChange$
  ).subscribe();
  
  constructor(private formBuilder: FormBuilder) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  public onSave() {
    this.save.next();
  }
  
  public onSearch(value: string) {
    this.form.patchValue({ searchValue: value });
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

  onTypeSelected(type: CardType) {
    this.form.patchValue({ cardTypes: [type] });
  }
  
  public exportToFile() {
    this.export.next();
  }

}
                                