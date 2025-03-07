import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Charmander extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 70;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    { name: 'Gnaw', cost: [CardType.FIRE], damage: 10, text: '' },
    { name: 'Flare', cost: [CardType.FIRE, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'HIF';

  public name: string = 'Charmander';

  public fullName: string = 'Charmander HIF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

}
