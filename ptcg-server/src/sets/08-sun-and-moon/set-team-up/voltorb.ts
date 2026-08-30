import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 50;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '38';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb TEU';
}
