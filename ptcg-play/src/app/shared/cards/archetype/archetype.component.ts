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
      default:
        this.archetype = 'unown';
    }
  }

  constructor() { }
}
