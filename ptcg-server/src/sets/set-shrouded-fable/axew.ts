import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Axew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 70;

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Scratch',
      cost: [CardType.FIGHTING],
      damage: 10,
      text: ''
    },
    {
      name: 'Sharp Fang',
      cost: [CardType.FIGHTING, CardType.METAL],
      damage: 30,
      text: ''
    },
  ];

  public regulationMark: string = 'H';

  public set: string = 'SFA';

  public name: string = 'Axew';

  public fullName: string = 'Axew SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

}