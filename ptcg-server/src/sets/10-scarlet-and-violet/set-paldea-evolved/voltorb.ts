import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Lightning Ball',
    cost: [L],
    damage: 10,
    text: ''
  },
  {
    name: 'Rollout',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb PAL';
}
