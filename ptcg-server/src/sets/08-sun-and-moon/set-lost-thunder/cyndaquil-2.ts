import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cyndaquil2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Hammer In',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'LOT';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cyndaquil';
  public fullName: string = 'Cyndaquil LOT 40';
}
