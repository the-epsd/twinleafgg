import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Punch',
      cost: [F],
      damage: 10,
      text: ''
    },
    {
      name: 'Low Kick',
      cost: [F, F],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu BUS';
}
