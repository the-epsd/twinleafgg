import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Baltoy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];
  public attacks = [
    {
      name: 'Beam',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Sand Spray',
      cost: [F, F],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'SSH';
  public name: string = 'Baltoy';
  public fullName: string = 'Baltoy SSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
}