import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cottonee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Attach',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cottonee';
  public fullName: string = 'Cottonee SSH';
}
