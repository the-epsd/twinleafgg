import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Vine Whip',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public set: string = 'BUS';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pansage';
  public fullName: string = 'Pansage BUS';
}
