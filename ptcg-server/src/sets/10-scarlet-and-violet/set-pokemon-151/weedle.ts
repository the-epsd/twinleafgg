import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Weedle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Bug Bite',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weedle';
  public fullName: string = 'Weedle MEW';
}
