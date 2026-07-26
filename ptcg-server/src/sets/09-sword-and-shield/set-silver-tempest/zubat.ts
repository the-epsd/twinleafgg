import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [D],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '103';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat SIT';
}
