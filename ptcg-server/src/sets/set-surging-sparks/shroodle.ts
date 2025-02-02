import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Shroodle extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = D;

  public hp: number = 60;

  public weakness = [{ type: F }];

  public retreat = [C];

  public attacks = [
    { name: 'Spray Fluid', cost: [D], damage: 20, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Shroodle';

  public fullName: string = 'Shroodle SSP';

  public regulationMark = 'H';

  public setNumber: string = '120';

  public cardImage: string = 'assets/cardback.png';

}
