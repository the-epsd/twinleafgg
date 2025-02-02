import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';

export class Nidorino extends PokemonCard {
  public cardType = CardType.DARK;
  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Nidoran M';
  public hp = 90;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Sharp Fang',
      cost: [CardType.DARK],
      damage: 30,
      text: ''
    },
    {
      name: 'Superpowered Horns',
      cost: [CardType.DARK, CardType.DARK, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Nidorino';
  public fullName: string = 'Nidorino MEW';

}
