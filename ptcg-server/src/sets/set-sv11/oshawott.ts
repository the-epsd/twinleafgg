import { PokemonCard, Stage, CardType } from "../../game";

export class Oshawott extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [W],
    damage: 10,
    text: ''
  }, {
    name: 'Water Gun',
    cost: [W, W],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Oshawott';
  public fullName: string = 'Oshawott SV11W';
}
