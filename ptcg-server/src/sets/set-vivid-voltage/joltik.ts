import { PokemonCard, Stage, CardType } from '../../game';

export class Joltik extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Bug Bite',
    cost: [L],
    damage: 20,
    text: ''
  }];

  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Joltik';
  public fullName: string = 'Joltik VIV';
}