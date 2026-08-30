import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Swinub extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CIN';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swinub';
  public fullName: string = 'Swinub CIN';
}
