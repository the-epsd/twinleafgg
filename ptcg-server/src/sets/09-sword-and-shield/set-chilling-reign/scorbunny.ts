import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Scorbunny extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType[] = [R];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Headbutt',
      cost: [R],
      damage: 20,
      text: '',
    },
  ];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scorbunny';
  public fullName: string = 'Scorbunny CRE';
}
