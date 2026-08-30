import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Flabebe2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 40;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'FLF';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flabébé';
  public fullName: string = 'Flabébé FLF 63';
}
