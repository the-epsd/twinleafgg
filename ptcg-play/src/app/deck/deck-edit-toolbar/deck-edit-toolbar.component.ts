import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';

import { Deck } from '../../api/interfaces/deck.interface';
import { DeckEditToolbarFilter } from './deck-edit-toolbar-filter.interface';
import { ControlContainer, FormBuilder, FormGroupDirective } from '@angular/forms';
import { filter, map, shareReplay, startWith, tap } from 'rxjs/operators';
import { merge } from 'rxjs';
import { CardTag, CardType, EnergyType, Format, Stage, SuperType, TrainerType } from 'ptcg-server';

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

  @Output() clearDeck = new EventEmitter<void>();

  @Input() selected: CardType[] = [];


  public onClearDeck() {
    this.clearDeck.emit();
  }

  public selectedSuperTypes: SuperType[] = [];

  public cardTypes = [
    { value: CardType.NONE, label: 'LABEL_NONE' },
    { value: CardType.COLORLESS, label: 'LABEL_COLORLESS' },
    { value: CardType.GRASS, label: 'LABEL_GRASS' },
    { value: CardType.FIGHTING, label: 'LABEL_FIGHTING' },
    { value: CardType.PSYCHIC, label: 'LABEL_PSYCHIC' },
    { value: CardType.WATER, label: 'LABEL_WATER' },
    { value: CardType.LIGHTNING, label: 'LABEL_LIGHTNING' },
    { value: CardType.METAL, label: 'LABEL_METAL' },
    { value: CardType.DARK, label: 'LABEL_DARK' },
    { value: CardType.FIRE, label: 'LABEL_FIRE' },
    { value: CardType.DRAGON, label: 'LABEL_DRAGON' },
    { value: CardType.FAIRY, label: 'LABEL_FAIRY' },
  ];

  public superTypes = [
    { value: SuperType.POKEMON, label: 'LABEL_POKEMON' },
    { value: SuperType.TRAINER, label: 'LABEL_TRAINER' },
    { value: SuperType.ENERGY, label: 'LABEL_ENERGY' },
  ];

  public stages = [
    { value: Stage.BASIC, label: 'CARDS_BASIC' },
    { value: Stage.STAGE_1, label: 'CARDS_STAGE_1' },
    { value: Stage.STAGE_2, label: 'CARDS_STAGE_2' }
  ];

  public formats = [
    { value: Format.STANDARD, label: 'LABEL_STANDARD' },
    { value: Format.STANDARD_NIGHTLY, label: 'Standard Nightly' },
    { value: Format.GLC, label: 'LABEL_GLC' },
    { value: Format.EXPANDED, label: 'LABEL_EXPANDED' },
    { value: Format.RETRO, label: 'LABEL_RETRO' },
    { value: Format.UNLIMITED, label: 'LABEL_UNLIMITED' },
  ];

  public energyTypes = [
    { value: EnergyType.BASIC, label: 'CARDS_BASIC_ENERGY' },
    { value: EnergyType.SPECIAL, label: 'CARDS_SPECIAL_ENERGY' }
  ];

  public trainerTypes = [
    { value: TrainerType.ITEM, label: 'CARDS_ITEM' },
    { value: TrainerType.STADIUM, label: 'CARDS_STADIUM' },
    { value: TrainerType.SUPPORTER, label: 'CARDS_SUPPORTER' },
    { value: TrainerType.TOOL, label: 'CARDS_POKEMON_TOOL' }
  ];

  public cardTags = [
    { value: CardTag.POKEMON_ex, label: 'Pokémon ex' },
    { value: CardTag.POKEMON_V, label: 'Pokémon V' },
    { value: CardTag.POKEMON_VMAX, label: 'Pokémon VMAX' },
    { value: CardTag.POKEMON_VSTAR, label: 'Pokémon VSTAR' },
    { value: CardTag.POKEMON_TERA, label: 'Pokémon Terastal' },
    { value: CardTag.RADIANT, label: 'Radiant' },
    { value: CardTag.FUTURE, label: 'Future' },
    { value: CardTag.ANCIENT, label: 'Ancient' },
    { value: CardTag.SINGLE_STRIKE, label: 'Single Strike' },
    { value: CardTag.RAPID_STRIKE, label: 'Rapid Strike' },
    { value: CardTag.FUSION_STRIKE, label: 'Fusion Strike' },
    { value: CardTag.POKEMON_GX, label: 'Pokémon GX' },
    { value: CardTag.TAG_TEAM, label: 'Tag Team' },
    { value: CardTag.ULTRA_BEAST, label: 'Ultra Beast' },
    { value: CardTag.POKEMON_EX, label: 'Pokémon EX' },
    { value: CardTag.TEAM_PLASMA, label: 'Team Plasma' },
    { value: CardTag.POKEMON_LV_X, label: 'Pokémon LV.X' },
    { value: CardTag.POKEMON_SP, label: 'Pokémon SP' },
  ];

  public attackCost = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5' }
  ];

  public retreatCost = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' }
  ];

  // public cardTags = Object.keys(CardTag).map(key => 
  //   ({value: CardTag[key], label: `${key}`})
  // );

  initialFormValue = {
    formats: [],
    cardTypes: [],
    superTypes: [],
    attackCosts: [],
    trainerTypes: [],
    retreatCosts: [],
    energyTypes: [],
    tags: [],
    stages: [],
    hasAbility: false,
    searchValue: null
  };

  form = this.formBuilder.group({
    formats: [[]],
    cardTypes: [[]],
    energyTypes: [[]],
    superTypes: [[]],
    attackCosts: [[]],
    retreatCosts: [[]],
    trainerTypes: [[]],
    tags: [[]],
    stages: [[]],
    hasAbility: false,

    searchValue: null
  });

  formValue$ = this.form.valueChanges.pipe(
    tap(console.log),
    startWith(this.initialFormValue),
    shareReplay(1)
  );

  showPokemonSearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(1) || value.superTypes.length === 0),
  );

  showTrainerSearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(2) || value.superTypes.length === 0)
  );

  showEnergySearchRow$ = this.formValue$.pipe(
    map(value => value.superTypes.includes(3) || value.superTypes.length === 0)
  );

  onFormChange$ = this.formValue$.pipe(
    tap(value => this.filterChange.emit({ ...value }))
  );

  isPokemonSelected(): boolean {
    return this.selectedSuperTypes.includes(SuperType.POKEMON);
  }

  isTrainerSelected(): boolean {
    return this.selectedSuperTypes.includes(SuperType.TRAINER);
  }

  isEnergySelected(): boolean {
    return this.selectedSuperTypes.includes(SuperType.ENERGY);
  }

  subscription = merge(
    this.onFormChange$,
  ).subscribe();

  constructor(private formBuilder: FormBuilder) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  resetPokemonFilters() {
    this.form.patchValue({
      hasAbility: null,
      cardTypes: [],
      attackCosts: [],
      retreatCosts: [],
      stages: []
    }, { emitEvent: false });
  }

  resetTrainerFilters() {
    this.form.patchValue({
      trainerTypes: []
    }, { emitEvent: false });
  }

  resetEnergyFilters() {
    this.form.patchValue({
      energyTypes: []
    }, { emitEvent: false });
  }

  public onSave() {
    this.save.next();
  }

  public onSearch(value: string) {
    // Replace curly apostrophes with straight apostrophes
    const normalizedValue = value.replace(/’|‘/g, '\'');
    this.form.patchValue({ searchValue: normalizedValue });
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
    const currentTypes = this.form.get('cardTypes').value;
    if (currentTypes.includes(type)) {
      this.form.patchValue({ cardTypes: [] });
    } else {
      this.form.patchValue({ cardTypes: [type] });
    }
  }

  public toggleSuperType(superType: SuperType): void {
    if (this.selectedSuperTypes.includes(superType)) {
      // If the clicked supertype is already selected, unselect it
      this.selectedSuperTypes = [];
    } else {
      // Otherwise, select only this supertype
      this.selectedSuperTypes = [superType];
    }

    // Reset all filters
    this.resetPokemonFilters();
    this.resetTrainerFilters();
    this.resetEnergyFilters();

    // Reset additional filters
    this.form.patchValue({
      formats: [],
      tags: [],
    }, { emitEvent: false });

    // Update the form control
    this.form.patchValue({ superTypes: this.selectedSuperTypes });
  }

  public exportToFile() {
    this.export.next();
  }

}
