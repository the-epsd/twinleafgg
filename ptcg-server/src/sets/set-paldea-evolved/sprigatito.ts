import { PokemonCard, Stage, CardType } from '../../game';

export class Sprigatito extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 70;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public attacks = [
    {
      name: 'Dig Claws',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PAL';
  public name: string = 'Sprigatito';
  public fullName: string = 'Sprigatito PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public regulationMark = 'G';

  // Additional methods and logic can be added here
}
