import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Rhyhorn extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Lunge Out',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Horn Drill',
    cost: [F, F, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'BUS';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rhyhorn';
  public fullName: string = 'Rhyhorn BUS';
}
