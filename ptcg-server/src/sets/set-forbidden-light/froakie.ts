import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

// FLI Froakie 22 (https://limitlesstcg.com/cards/FLI/22)
export class Froakie extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Rain Splash', cost: [CardType.WATER], damage: 10, text: '' },
    { name: 'Wave Splash', cost: [CardType.WATER, CardType.COLORLESS], damage: 20, text: '' }
  ];

  public set: string = 'FLI';

  public setNumber = '22';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Froakie';

  public fullName: string = 'Froakie FLI';

}