import { Component, Input } from '@angular/core';
import { DeckItem } from '../deck-card/deck-card.interface';
import { SuperType } from 'ptcg-server';

@Component({
  selector: 'ptcg-deck-edit-info',
  templateUrl: './deck-edit-info.component.html',
  styleUrls: ['./deck-edit-info.component.scss']
})
export class DeckEditInfoComponent {

  public cardsCount = 0;
  public pokemonCount = 0;
  public trainerCount = 0;
  public energyCount = 0;

  @Input() set deckItems(value: DeckItem[]) {
    this.cardsCount = value.reduce((prev, val) => prev + val.count, 0);
    this.pokemonCount = 0;
    this.trainerCount = 0;
    this.energyCount = 0;

    value.forEach(item => {
      const superType = item.card.superType;
      const count = item.count;

      if (superType === SuperType.POKEMON) {
        this.pokemonCount += count;
      } else if (superType === SuperType.TRAINER) {
        this.trainerCount += count;
      } else if (superType === SuperType.ENERGY) {
        this.energyCount += count;
      }
    });
  }

  constructor() { }

}
