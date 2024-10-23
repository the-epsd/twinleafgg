import { PokemonCard, Stage, CardType } from '../../game';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = R;

  public hp: number = 90;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Slash',
      cost: [R, C],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SVM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '15';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken SVM';

}