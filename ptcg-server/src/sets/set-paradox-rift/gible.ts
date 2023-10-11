import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Gible extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [{
    name: 'Bite',
    cost: [ CardType.FIGHTING ],
    damage: 20,
    text: ''
  }
  ];

  public set: string = 'PAR';

  public set2: string = 'ragingsurf';

  public setNumber: string = '27';

  public name: string = 'Gible';

  public fullName: string = 'Gible PAR';
}