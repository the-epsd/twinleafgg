import { CardType, Stage } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Sneasel extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public regulationMark: string = 'H';

  public hp: number = 60;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Claw Slash',
      cost: [CardType.DARK],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'PRE';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public name: string = 'Sneasel';

  public fullName: string = 'Sneasel PRE';
}