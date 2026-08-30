import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Spheal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Icy Snow',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Spheal';
  public fullName: string = 'Spheal CEC';
}
