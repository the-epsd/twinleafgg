import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Pignite extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tepig';
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType[] = [R];
  public hp: number = 100;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Ram',
      cost: [C, C],
      damage: 30,
      text: '',
    },
    {
      name: 'Combustion',
      cost: [R, R, C],
      damage: 90,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '24';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite BST';
}
