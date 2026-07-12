import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { Attack } from '../../../game/store/card/pokemon-types';

export class Nidorino extends PokemonCard {
  public cardType = CardType.DARK;
  public stage = Stage.STAGE_1;
  public evolvesFrom = '♂';
  public hp = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks: Attack[] = [
    {
      name: 'Sharp Fang',
      cost: [D],
      damage: 30,
      text: '',
    },
    {
      name: 'Superpowered Horns',
      cost: [D, D, C],
      damage: 100,
      text: '',
    },
  ];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Nidorino';
  public fullName: string = 'Nidorino MEW';
}
