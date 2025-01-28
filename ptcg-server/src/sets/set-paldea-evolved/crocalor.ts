import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Crocalor extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Fuecoco';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Steady Firebreathing',
      cost: [R],
      damage: 30,
      text: ''
    },
    {
      name: 'Hyper Voice',
      cost: [R, R],
      damage: 70,
      text: ''
    },
  ];

  public set: string = 'PAL';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Crocalor';
  public fullName: string = 'Crocalor PAL';
}
