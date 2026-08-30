import { PokemonCard, Stage, CardType } from "../../../game";

/** #35 — Rollout */
export class Pikachu35 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Rollout',
    cost: [C, C],
    damage: 30,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 35';
}
