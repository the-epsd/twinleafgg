import { Component, Input } from '@angular/core';
import { Archetype } from 'ptcg-server';

@Component({
  selector: 'ptcg-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.scss']
})
export class ArchetypeComponent {

  public typeClass = 'archetypeless';

  @Input() set type(value: Archetype) {
    switch (value) {
      case Archetype.CHARIZARD:
        this.typeClass = 'charizard';
        break;
      case Archetype.GRASS:
        this.typeClass = 'grass';
        break;
      case Archetype.FIGHTING:
        this.typeClass = 'fighting';
        break;
      case Archetype.PSYCHIC:
        this.typeClass = 'psychic';
        break;
      case Archetype.WATER:
        this.typeClass = 'water';
        break;
      case Archetype.LIGHTNING:
        this.typeClass = 'lightning';
        break;
      case Archetype.METAL:
        this.typeClass = 'metal';
        break;
      case Archetype.DARK:
        this.typeClass = 'darkness';
        break;
      case Archetype.FIRE:
        this.typeClass = 'fire';
        break;
      case Archetype.DRAGON:
        this.typeClass = 'dragon';
        break;
      case Archetype.FAIRY:
        this.typeClass = 'fairy';
        break;
      default:
        this.typeClass = 'archetypeless';
        break;
    }
  }

  constructor() { }

}
