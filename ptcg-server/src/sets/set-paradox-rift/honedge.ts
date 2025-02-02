import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';


export class Honedge extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIRE }];
  
  public resistance = [{ type: CardType.GRASS, value: -30 }];  

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Cut Up',
    cost: [ CardType.METAL ],
    damage: 20,
    text: ''
  }];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '130';

  public name: string = 'Honedge';

  public fullName: string = 'Honedge PAR';

}