import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Helioptile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Static Shock',
    cost: [L],
    damage: 10,
    text: ''
  },
  {
    name: 'Rear Kick',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'CRZ';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Helioptile';
  public fullName: string = 'Helioptile CRZ 49';
}
