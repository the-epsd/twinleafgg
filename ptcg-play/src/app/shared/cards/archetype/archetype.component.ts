import { Component, Input } from "@angular/core";
import { Archetype } from "ptcg-server";

@Component({
  selector: 'ptcg-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.scss']
})
export class ArchetypeComponent {

  public typeClass = 'unown';
  public archetype = 'unown';

  @Input() set class(value: Archetype) {
    switch (value) {
      case Archetype.UNOWN:
        this.archetype = 'unown';
        break;
      case Archetype.ARCEUS:
        this.archetype = 'arceus';
        break;
      case Archetype.CHARIZARD:
        this.archetype = 'charizard';
        break;
      case Archetype.PIDGEOT:
        this.archetype = 'pidgeot';
        break;
      case Archetype.MIRAIDON:
        this.archetype = 'miraidon';
        break;
      case Archetype.PIKACHU:
        this.archetype = 'pikachu';
        break;
      case Archetype.RAGING_BOLT:
        this.archetype = 'raging-bolt';
        break;
      case Archetype.GIRATINA:
        this.archetype = 'giratina';
        break;
      case Archetype.PALKIA_ORIGIN:
        this.archetype = 'palkia-origin';
        break;
      case Archetype.COMFEY:
        this.archetype = 'comfey';
        break;
      case Archetype.IRON_THORNS:
        this.archetype = 'iron-thorns';
        break;
      case Archetype.TERAPAGOS:
        this.archetype = 'terapagos';
        break;
      case Archetype.REGIDRAGO:
        this.archetype = 'regidrago';
        break;
      case Archetype.SNORLAX:
        this.archetype = 'snorlax';
        break;
      case Archetype.GARDEVOIR:
        this.archetype = 'gardevoir';
        break;
      case Archetype.ROARING_MOON:
        this.archetype = 'roaring-moon';
        break;
      case Archetype.CERULEDGE:
        this.archetype = 'ceruledge';
        break;
      case Archetype.DRAGAPULT:
        this.archetype = 'dragapult';
        break;
      default:
        this.archetype = 'unown';
    }
  }

  constructor() { }
}
