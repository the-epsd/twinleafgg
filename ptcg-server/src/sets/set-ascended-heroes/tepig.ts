import { PokemonCard, Stage, CardType } from '../../game';

export class Tepig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Steady Firebreathing',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Tepig';
  public fullName: string = 'Tepig MC';
}