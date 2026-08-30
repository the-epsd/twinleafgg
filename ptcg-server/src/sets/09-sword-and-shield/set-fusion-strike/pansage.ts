import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pansage extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Scratch',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '7';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pansage';
  public fullName: string = 'Pansage FST 7';
}
