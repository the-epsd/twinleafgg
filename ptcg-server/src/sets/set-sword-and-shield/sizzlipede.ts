import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sizzlipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Bite',
      cost: [R],
      damage: 10,
      text: '',
    },
    {
      name: 'Combustion',
      cost: [R, C, C],
      damage: 50,
      text: '',
    },
  ];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public name: string = 'Sizzlipede';
  public fullName: string = 'Sizzlipede SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '37';
}
