import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Seel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Rain Splash',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seel';
  public fullName: string = 'Seel LOR 33';
}
