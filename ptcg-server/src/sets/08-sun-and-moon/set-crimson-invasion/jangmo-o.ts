import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class JangmoO extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 60;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Gentle Slap',
    cost: [L, F],
    damage: 20,
    text: ''
  }];

  public set: string = 'CIN';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jangmo-o';
  public fullName: string = 'Jangmo-o CIN';
}
