import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Purrloin extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = D;

  public hp: number = 60;

  public weakness = [{
    type: CardType.FIGHTING
  }];

  public resistance = [{
    type: CardType.PSYCHIC,
    value: -20
  }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    { name: 'Scratch', cost: [C], damage: 10, text: '' },
    { name: 'Slash', cost: [D, C], damage: 20, text: '' }
  ];

  public set: string = 'BLW';

  public name: string = 'Purrloin';

  public fullName: string = 'Purrloin BLW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

}
