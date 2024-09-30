import { PokemonCard, Stage, CardType } from '../../game';
export class Togepi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Flutter',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SV8';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togepi';
  public fullName: string = 'Togepi SV8';
}