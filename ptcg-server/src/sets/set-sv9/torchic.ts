import { PokemonCard, Stage, CardType } from '../../game';

export class Torchic extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 60;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Scratch',
      cost: [R, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'H';

  public set: string = 'SVM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '14';

  public name: string = 'Torchic';

  public fullName: string = 'Torchic SVM';

}
