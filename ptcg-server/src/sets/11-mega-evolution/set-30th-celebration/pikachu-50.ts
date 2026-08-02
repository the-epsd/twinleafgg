import { PokemonCard, Stage, CardType } from "../../../game";

/** #50 — Satisfied Spark */
export class Pikachu50 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];
  public attacks = [{
    name: 'Satisfied Spark',
    cost: [L, L, C, C],
    damage: 100,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 50';
}
