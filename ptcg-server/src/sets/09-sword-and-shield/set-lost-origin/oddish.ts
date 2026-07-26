import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Oddish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Oddish';
  public fullName: string = 'Oddish LOR 1';
}
