import { Attack, CardType, PokemonCard, Stage, Weakness } from '../../game';

export class Bramblin extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness: Weakness[] = [{ type: R }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Spike Sting', cost: [C, C], damage: 30, text: '' },
  ];

  public set: string = 'TEF';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Bramblin';
  public fullName: string = 'Bramblin TEF';
}