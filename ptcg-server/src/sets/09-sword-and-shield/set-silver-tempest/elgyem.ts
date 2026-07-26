import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Elgyem extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [P],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'SIT';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Elgyem';
  public fullName: string = 'Elgyem SIT';
}
