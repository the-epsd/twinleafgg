import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game';

export class Skrelp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = D;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Hook',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Skrelp';
  public fullName: string = 'Skrelp M4';
}
