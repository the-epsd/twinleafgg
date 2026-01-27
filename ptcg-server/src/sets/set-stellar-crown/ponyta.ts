import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ponyta extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flop',
      cost: [R],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Ponyta';
  public fullName: string = 'Ponyta SCR';
  public regulationMark = 'H';

}
