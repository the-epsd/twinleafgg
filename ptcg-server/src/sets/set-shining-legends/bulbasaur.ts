import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Bulbasaur extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [G, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'SLG';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bulbasaur';
  public fullName: string = 'Bulbasaur SLG';
}
