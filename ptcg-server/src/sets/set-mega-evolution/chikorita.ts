import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Chikorita extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Leaf',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public set: string = 'M1S';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Chikorita';
  public fullName: string = 'Chikorita M1S';
  public regulationMark: string = 'I';
}

