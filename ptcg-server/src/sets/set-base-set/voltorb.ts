import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Voltorb extends PokemonCard {

  public name = 'Voltorb';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '67';

  public set = 'BS';

  public cardType = CardType.LIGHTNING;

  public fullName = 'Voltorb BS';

  public stage = Stage.BASIC;

  public evolvesInto = ['Electrode', 'Electrode-GX', 'Dark Electrode', 'Electrode ex'];

  public hp = 40;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Tackle',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    }
  ];

}
