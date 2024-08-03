import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Staryu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 40;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [];

  public retreat = [];

  public attacks = [
    {
      name: 'Smack',
      cost: [CardType.WATER],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'BKP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public name: string = 'Staryu';

  public fullName: string = 'Staryu BKP';

}