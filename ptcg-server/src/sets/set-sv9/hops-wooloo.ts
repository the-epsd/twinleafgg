import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class HopsWooloo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.HOPS];

  public cardType: CardType = C;

  public hp: number = 70;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Smash Kick',
      cost: [C, C, C],
      damage: 50,
      text: ''
    }
  ];

  public regulationMark = 'I';

  public set: string = 'SV9';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '85';

  public name: string = 'Hop\'s Wooloo';

  public fullName: string = 'Hop\'s Wooloo SV9';

}