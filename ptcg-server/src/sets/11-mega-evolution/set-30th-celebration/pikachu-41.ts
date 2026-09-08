import { PokemonCard, Stage, CardType } from "../../../game";

/** #41 — Hang Down + Zap Kick */
export class Pikachu41 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Hang Down',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Zap Kick',
    cost: [L, C, C],
    damage: 40,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 41';
}
