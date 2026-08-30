import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Oshawott extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Water Gun',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'STS';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Oshawott';
  public fullName: string = 'Oshawott STS';
}
