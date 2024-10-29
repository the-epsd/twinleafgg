import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Charcadet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 70;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Phantom Fire',
      cost: [CardType.FIRE],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Charcadet';
  public fullName: string = 'Charcadet SVP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
}
