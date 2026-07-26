import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Mudbray extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Stampede',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Rear Kick',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '105';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mudbray';
  public fullName: string = 'Mudbray SSH';
}
