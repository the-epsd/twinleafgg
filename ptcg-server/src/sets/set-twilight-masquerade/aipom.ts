import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Aipom extends PokemonCard {
  public regulationMark = 'H';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Hang Down',
      cost: [ C ],
      damage: 10,
      text: ''
    },
    {
      name: 'Playful Kick',
      cost: [ C, C ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';
  public name: string = 'Aipom';
  public fullName: string = 'Aipom TWM';
}