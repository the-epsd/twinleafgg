import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Grookey extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Smash Kick',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Branch Poke',
    cost: [G, G],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grookey';
  public fullName: string = 'Grookey TWM';
}
