import { PokemonCard, Stage, CardType } from '../../game';

export class Snivy extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [G],
    damage: 10,
    text: ''
  }, {
    name: 'Vine Whip',
    cost: [G, G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snivy';
  public fullName: string = 'Snivy SV11B';
}
