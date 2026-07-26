import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Low Kick',
    cost: [F, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'PLB';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machop';
  public fullName: string = 'Machop PLB';
}
