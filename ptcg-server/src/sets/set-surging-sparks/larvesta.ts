import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Larvesta extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 70;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public attacks = [
    { name: 'Ram', cost: [C], damage: 10, text: '' },
    { name: 'Steady Firebreathing', cost: [R, C], damage: 20, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Larvesta';

  public fullName: string = 'Larvesta SSP';

  public regulationMark = 'H';

  public setNumber: string = '24';

  public cardImage: string = 'assets/cardback.png';

}