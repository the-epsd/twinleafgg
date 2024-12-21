import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 80;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public evolvesInto = 'Pignite';

  public attacks = [{
    name: 'Ram',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  },
  {
    name: 'Combustion',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 50,
    text: ''
  }
  ];

  public regulationMark = 'E';
  public set: string = 'SWSH';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig SWSH';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '172';
}