import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charmander';
  public cardType: CardType = R;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [C, C],
      damage: 30,
      text: ''
    },
    {
      name: 'Heat Blast',
      cost: [R, R, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '19';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon BUS';
}