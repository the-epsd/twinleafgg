import { Attack, CardType, PokemonCard, Resistance, Stage, Weakness } from "../../game";

export class Metang extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Beldum';
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness: Weakness[] = [{ type: D }];
  public resistance: Resistance[] = [{ type: F, value: -30 }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    { name: 'Psypunch', cost: [P], damage: 30, text: '' },
    { name: 'Zen Headbutt', cost: [P, P], damage: 50, text: '' },
  ];

  public set: string = 'SV9';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Metang';
  public fullName: string = 'Metang SV9';
}