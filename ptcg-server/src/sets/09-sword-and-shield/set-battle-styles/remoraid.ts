import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Remoraid extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Water Gun',
      cost: [W],
      damage: 10,
      text: '',
    },
    {
      name: 'Sharp Fin',
      cost: [C, C],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Remoraid';
  public fullName: string = 'Remoraid BST';
}
