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
                  case CardType.BIBAREL:
                    this.archetypeClass = 'bibarel';
                    break;
                  case CardType.IRON_CROWN_EX:
                    this.archetypeClass = 'iron-crown';
                    break;
                  case CardType.GHOLDENGO_EX:
                    this.archetypeClass = 'gholdengo';
                    break;
                  case CardType.PALKIA_VSTAR:
                    this.archetypeClass = 'palkia-origin';
                    break;
                  case CardType.BLISSEY_EX:
                    this.archetypeClass = 'blissey';
                    break;
                  case CardType.CINCINNO:
                    this.archetypeClass = 'cinccino';
                    break;
                  case CardType.DRAGAPULT_EX:
                    this.archetypeClass = 'dragapult';
                    break;
                  case CardType.DRIFLOON:
                    this.archetypeClass = 'drifloon';
                    break;
                  case CardType.FROSLASS:
                    this.archetypeClass = 'froslass';
                    break;
                  case CardType.GARDEVOIR_EX:
                    this.archetypeClass = 'gardevoir';
                    break;
                  case CardType.GRENINJA_EX:
                    this.archetypeClass = 'greninja';
                    break;
                  case CardType.IRON_HANDS_EX:
                    this.archetypeClass = 'iron-hands';
                    break;
                  case CardType.KORAIDON:
                    this.archetypeClass = 'koraidon';
                    break;
                  case CardType.LUXRAY_EX:
                    this.archetypeClass = 'luxray';
                    break;
                  case CardType.MIRAIDON_EX:
                    this.archetypeClass = 'miraidon';
                    break;
                  case CardType.TEALMASK_OGERPON_EX:
                    this.archetypeClass = 'ogerpon';
                    break;
                  case CardType.THWACKEY:
                    this.archetypeClass = 'thwackey';
                    break;
                  case CardType.ROARING_MOON:
                    this.archetypeClass = 'roaring-moon';
                    break;
                  case CardType.ROTOM_V:
                    this.archetypeClass = 'rotom';
                    break;
                  case CardType.SANDY_SHOCKS_EX:
                    this.archetypeClass = 'sandy-shocks';
                    break;
                  case CardType.XATU:
                    this.archetypeClass = 'xatu';
                    break;
      default:
        this.archetypeClass = 'energyless';
    }
  }

  constructor() { }

}
