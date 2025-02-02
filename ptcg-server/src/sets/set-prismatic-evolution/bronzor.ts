import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Bronzor extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Hammer In',
      cost: [ M, C ],
      damage: 20,
      text: '',
    }
  ];

  public regulationMark = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Bronzor';
  public fullName: string = 'Bronzor PRE';
}