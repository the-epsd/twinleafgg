import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Capsakid extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = G;

  public hp: number = 70;

  public weakness = [{ type: R }];

  public retreat = [C];

  public attacks = [
    { name: 'Headbutt Bounce', cost: [C, C], damage: 20, text: '' }
  ];

  public set: string = 'SSP';

  public name: string = 'Capsakid';

  public fullName: string = 'Capsakid SSP';

  public regulationMark = 'H';

  public setNumber: string = '12';

  public cardImage: string = 'assets/cardback.png';

}