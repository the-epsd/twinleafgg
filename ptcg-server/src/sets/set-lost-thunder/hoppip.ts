import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Hoppip extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Tackle',
      cost: [ CardType.GRASS ],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'LOT';

  public setNumber = '12';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Hoppip';

  public fullName: string = 'Hoppip LOT';

}
