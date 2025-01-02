import { PokemonCard, Stage, CardType } from '../../game';

export class Piloswine extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Swinub';

  public cardType: CardType = F;

  public hp: number = 100;

  public weakness = [{ type: G }];

  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Strength',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Piercing Fangs',
      cost: [F, F],
      damage: 50,
      text: ''
    },
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '45';

  public name: string = 'Piloswine';

  public fullName: string = 'Piloswine SV9';

}
