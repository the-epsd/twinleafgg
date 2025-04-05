import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';

export class IonosTadbulb extends PokemonCard {

  public tags = [CardTag.IONOS];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = L;

  public hp: number = 60;

  public weakness = [{ type: F }];

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Tiny Charge',
      cost: [L, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'I';

  public cardImage: string = 'assets/cardback.png';

  public set: string = 'JTG';

  public setNumber = '52';

  public name: string = 'Iono\'s Tadbulb';

  public fullName: string = 'Iono\'s Tadbulb JTG';

}