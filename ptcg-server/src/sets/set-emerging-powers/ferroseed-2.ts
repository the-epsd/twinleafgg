import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ferroseed2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Pierce',
      cost: [M, M],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Ferroseed';
  public fullName: string = 'Ferroseed EPO 71';
}
