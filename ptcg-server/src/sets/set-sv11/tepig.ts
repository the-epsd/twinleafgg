import { PokemonCard, Stage, CardType } from "../../game";

export class Tepig extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [R],
    damage: 10,
    text: ''
  }, {
    name: 'Rollout',
    cost: [R, R],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV11W';
  public setNumber = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig SV11W';
}
