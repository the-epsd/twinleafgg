import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Applin extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spray Fluid',
      cost: [G],
      damage: 20,
      text: '',
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Applin';
  public fullName: string = 'Applin SCR';
}