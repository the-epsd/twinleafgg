import { Attack, CardType, PokemonCard, Stage, Weakness } from "../../game";

export class Drifloon extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: D }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Beat', cost: [C], damage: 10, text: '' },
    { name: 'Gust', cost: [P, C], damage: 20, text: '' },
  ];

  public set: string = 'DRX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Drifloon';
  public fullName: string = 'Drifloon DRX';
}