import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class DucklettDAA extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Flap', cost: [CardType.COLORLESS], damage: 20, text: '' },
  ];

  public set: string = 'DAA';

  public setNumber: string = '148';

  public regulationMark: string = 'D';

  public name: string = 'Ducklett';

  public fullName: string = 'Ducklett DAA';

}