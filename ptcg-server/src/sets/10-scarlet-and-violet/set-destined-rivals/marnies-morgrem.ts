import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class MarniesMorgrem extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = "Marnie's Impidimp";
  protected _tags = [CardTag.MARNIES];
  public cardType: CardType[] = [D];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Corkscrew Punch',
      cost: [D, D],
      damage: 60,
      text: '',
    },
  ];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '135';
  public cardImage: string = 'assets/cardback.png';
  public name: string = "Marnie's Morgrem";
  public fullName: string = "Marnie's Morgrem DRI";
}
