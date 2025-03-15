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
      case Archetype.ARCHALUDON:
        this.archetype = 'archaludon';
        break;
      case Archetype.KLAWF:
        this.archetype = 'klawf';
        break;
      case Archetype.GOUGING_FIRE:
        this.archetype = 'gouging-fire';
        break;
      case Archetype.GHOLDENGO:
        this.archetype = 'gholdengo';
        break;
      case Archetype.IRON_CROWN:
        this.archetype = 'iron-crown';
        break;
      case Archetype.FERALIGATR:
        this.archetype = 'feraligatr';
        break;
      case Archetype.BLISSEY:
        this.archetype = 'blissey';
        break;
      case Archetype.MILOTIC:
        this.archetype = 'milotic';
        break;
      case Archetype.TEAL_MASK_OGERPON:
        this.archetype = 'teal-mask-ogerpon';
        break;
      case Archetype.ZOROARK:
        this.archetype = 'zorark';
        break;
      case Archetype.BELLIBOLT:
        this.archetype = 'bellibolt';
        break;
      case Archetype.FLAREON:
        this.archetype = 'flareon';
        break;
      case Archetype.TYRANITAR:
        this.archetype = 'tyrantiar';
        break;
      case Archetype.SLOWKING:
        this.archetype = 'slowking';
        break;
      case Archetype.MAMOSWINE:
        this.archetype = 'mamoswine';
        break;
      case Archetype.CLEFAIRY:
        this.archetype = 'clefairy';
        break;
      case Archetype.ZACIAN:
        this.archetype = 'zacian';
        break;
      case Archetype.FROSLASS:
        this.archetype = 'froslass';
        break;
      case Archetype.DIPPLIN:
        this.archetype = 'dipplin';
        break;
      case Archetype.ROTOM:
        this.archetype = 'rotom';
        break;
      case Archetype.HYDRAPPLE:
        this.archetype = 'hydrapple';
        break;
      case Archetype.GARCHOMP:
        this.archetype = 'garchomp';
        break;
      case Archetype.HOOH:
        this.archetype = 'hooh';
        break;
      case Archetype.HYDREIGON:
        this.archetype = 'hydreigon';
        break;
      case Archetype.MEGA_GARDEVOIR:
        this.archetype = 'mega-gardevoir';
        break;
      default:
        this.archetype = 'unown';
    }
  }

  constructor() { }
}
