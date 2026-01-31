import { PokemonCard, Stage, CardType } from "../../game";

export class Charmeleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charmander';
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Heat Blast',
    cost: [R, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Charmeleon';
  public fullName: string = 'Charmeleon MC';
}