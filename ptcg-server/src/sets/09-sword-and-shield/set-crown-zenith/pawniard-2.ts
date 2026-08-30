import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pawniard2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [M];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Pierce',
    cost: [M],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pawniard';
  public fullName: string = 'Pawniard CRZ 92';
}
