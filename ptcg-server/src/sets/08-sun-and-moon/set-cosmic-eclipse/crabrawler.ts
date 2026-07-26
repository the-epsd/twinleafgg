import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Crabrawler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Jab',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Confront',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '121';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crabrawler';
  public fullName: string = 'Crabrawler CEC';
}
