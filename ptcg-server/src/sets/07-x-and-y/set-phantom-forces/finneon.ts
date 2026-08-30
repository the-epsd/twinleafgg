import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Finneon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'PHF';
  public setNumber: string = '18';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Finneon';
  public fullName: string = 'Finneon PHF';
}
