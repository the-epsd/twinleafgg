import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Shinx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType[] = [L];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Rear Kick',
      cost: [L],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'BST';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx BST';
}
