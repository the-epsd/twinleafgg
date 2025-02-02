import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class NidoranMale extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Horn Attack',
      cost: [CardType.DARK],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Nidoran M';
  public fullName: string = 'Nidoran M MEW';

}