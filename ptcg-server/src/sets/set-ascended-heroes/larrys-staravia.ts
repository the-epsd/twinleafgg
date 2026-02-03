import { PokemonCard, Stage, CardTag, CardType } from "../../game";

export class LarrysStaravia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.LARRYS];
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flap',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Razor Wing',
    cost: [C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '169';
  public name: string = 'Larry\'s Staravia';
  public fullName: string = 'Larry\'s Staravia MC';
}