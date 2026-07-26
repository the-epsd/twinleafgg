import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Mudbray extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Rear Kick',
    cost: [F, F, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'VIV';
  public setNumber: string = '96';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mudbray';
  public fullName: string = 'Mudbray VIV';
}
