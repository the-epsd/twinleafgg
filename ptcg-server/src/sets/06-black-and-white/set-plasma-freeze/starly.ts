import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Starly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'PLF';
  public setNumber: string = '95';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Starly';
  public fullName: string = 'Starly PLF';
}
