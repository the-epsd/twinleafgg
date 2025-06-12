import { Attack, CardType, PokemonCard, Stage, Weakness } from '../../game';

export class Weedle extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness: Weakness[] = [{ type: R }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Ram', cost: [G], damage: 10, text: '' },
    { name: 'Bug Bite', cost: [C, C], damage: 20, text: '' },
  ];

  public set: string = 'MEW';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Weedle';
  public fullName: string = 'Weedle MEW';
}