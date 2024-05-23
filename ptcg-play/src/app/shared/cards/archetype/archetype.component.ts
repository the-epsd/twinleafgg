import { Component, Input } from '@angular/core';
import { CardType } from 'ptcg-server';

@Component({
  selector: 'ptcg-archetype',
  templateUrl: './archetype.component.html',
  styleUrls: ['./archetype.component.scss']
})
export class ArchetypeComponent {

  public typeClass = 'energyless';
  public archetypeClass = 'energyless';

  @Input() set type(value: CardType) {
    switch (value) {
      case CardType.COLORLESS:
        this.typeClass = 'colorless';
        break;
      case CardType.CHARIZARD_EX:
        this.archetypeClass = 'charizard';
        break;
      case CardType.PIDGEOT_EX:
        this.archetypeClass = 'pidgeot';
        break;
      case CardType.ARCEUS_VSTAR:
        this.archetypeClass = 'arceus';
        break;
      case CardType.GIRATINA_VSTAR:
        this.archetypeClass = 'giratina';
        break;
      case CardType.CHIEN_PAO_EX:
        this.archetypeClass = 'chien-pao';
        break;
      case CardType.BAXCALIBUR:
        this.archetypeClass = 'baxcalibur';
        break;
      case CardType.COMFEY:
        this.archetypeClass = 'comfey';
        break;
      case CardType.SABLEYE:
        this.archetypeClass = 'sableye';
        break;
      case CardType.RAGING_BOLT_EX:
        this.archetypeClass = 'raging-bolt';
        break;
      case CardType.SOLROCK:
        this.archetypeClass = 'solrock';
        break;
      case CardType.LUNATONE:
        this.archetypeClass = 'lunatone';
        break;
      case CardType.MURKROW:
        this.archetypeClass = 'murkrow';
        break;
      case CardType.FLAMIGO:
        this.archetypeClass = 'flamigo';
        break;
      case CardType.KYUREM_VMAX:
        this.archetypeClass = 'kyurem';
        break;
        case CardType.SNORLAX_STALL:
          this.archetypeClass = 'snorlax';
          break;
          case CardType.LUGIA_VSTAR:
            this.archetypeClass = 'lugia';
            break;
            case CardType.ABSOL_EX:
              this.archetypeClass = 'absol';
              break;
              case CardType.DIPPLIN:
                this.archetypeClass = 'dipplin';
                break;
                case CardType.THWACKEY:
                  this.archetypeClass = 'thwackey';
                  break;
      default:
        this.archetypeClass = 'energyless';
    }
  }

  constructor() { }

}
