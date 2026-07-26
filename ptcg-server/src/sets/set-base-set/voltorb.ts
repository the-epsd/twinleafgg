import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BS';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb BS';
}
