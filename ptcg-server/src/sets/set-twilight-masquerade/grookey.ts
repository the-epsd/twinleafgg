import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Grookey extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Smash Kick',
      cost: [CardType.GRASS],
      damage: 10,
      text: ''
    },
    {
      name: 'Branch Poke',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Grookey';

  public fullName: string = 'Grookey TWM';
}