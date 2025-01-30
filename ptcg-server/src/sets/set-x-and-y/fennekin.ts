import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Fennekin extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Will-O-Wisp',
      cost: [ R ],
      damage: 20,
      text: '   '
    }
  ];

  public set: string = 'XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Fennekin';
  public fullName: string = 'Fennekin XY';
}