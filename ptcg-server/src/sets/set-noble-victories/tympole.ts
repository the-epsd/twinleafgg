import { Attack, CardType, PokemonCard, Stage, Weakness } from "../../game";

export class Tympole extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Vibration', cost: [C], damage: 10, text: '' },
    { name: 'Mud Shot', cost: [W, C], damage: 20, text: '' },
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole NVI';
}