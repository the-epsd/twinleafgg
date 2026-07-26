import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Seed Bomb',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pansage';
  public fullName: string = 'Pansage DAA';
}
