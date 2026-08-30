import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Fin',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Water Gun',
    cost: [W, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'SLG';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Buizel';
  public fullName: string = 'Buizel SLG';
}
