import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sizzlipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [ C, C ];

  public attacks = [
    { name: 'Live Coal', cost: [R], damage: 10, text: '' },
    { name: 'Hook', cost: [C, C, C], damage: 30, text: '' },
  ];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';

  public name: string = 'Sizzlipede';
  public fullName: string = 'Sizzlipede SSP';
  
}