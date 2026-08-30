import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Buneary extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Smash Kick',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '116';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Buneary';
  public fullName: string = 'Buneary BCR';
}
