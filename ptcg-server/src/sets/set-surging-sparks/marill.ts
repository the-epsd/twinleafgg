import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 60;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rolling Tackle',
      cost: [CardType.PSYCHIC],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Marill';
  public fullName: string = 'Marill svLN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
}
