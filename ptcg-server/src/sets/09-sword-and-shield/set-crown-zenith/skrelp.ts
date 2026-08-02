import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Skrelp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Melt',
    cost: [D, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skrelp';
  public fullName: string = 'Skrelp CRZ 81';
}
