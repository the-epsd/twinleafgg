import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Staryu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Staryu';
  public fullName: string = 'Staryu M3';
}