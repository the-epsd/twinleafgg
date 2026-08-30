import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Corphish extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 50;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Guillotine',
    cost: [C, C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HP';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Corphish';
  public fullName: string = 'Corphish HP';
}
