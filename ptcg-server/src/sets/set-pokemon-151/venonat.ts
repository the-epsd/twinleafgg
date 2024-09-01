import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Venonat extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    {
      name: 'Gnaw',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: '',
    },
    {
      name: 'Beam',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 40,
      text: '',
    }
  ];
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Venonat';
  public fullName: string = 'Venonat MEW';

}