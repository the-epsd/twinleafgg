import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pansear extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = R;

  public hp: number = 60;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    { name: 'Combustion', cost: [R], damage: 20, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Pansear';

  public fullName: string = 'Pansear SSP';

  public regulationMark = 'H';

  public setNumber: string = '22';

  public cardImage: string = 'assets/cardback.png';

}