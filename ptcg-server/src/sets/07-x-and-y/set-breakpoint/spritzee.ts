import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Spritzee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Beat',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Spritzee';
  public fullName: string = 'Spritzee BKP';
}
