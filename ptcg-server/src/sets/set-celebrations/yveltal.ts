import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';


export class Yveltal extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Cry of Destruction',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Discard up to 3 Special Energy from your opponent\'s Pokémon.'
    },
    {
      name: 'Dark Feather',
      cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Yveltal';

  public fullName: string = 'Yveltal CEL';

}