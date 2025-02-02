import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sandygast extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = P;

  public hp: number = 90;

  public weakness = [{ type: D }];

  public resistance = [{ type: F, value: -30 }];

  public retreat = [C, C, C];

  public attacks = [
    { name: 'Sand Spray', cost: [C, C, C], damage: 50, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Sandygast';

  public fullName: string = 'Sandygast SSP';

  public regulationMark = 'H';

  public setNumber: string = '90';

  public cardImage: string = 'assets/cardback.png';

}
