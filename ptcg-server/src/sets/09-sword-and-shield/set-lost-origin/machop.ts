import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punch',
    cost: [F],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'f';
  public set: string = 'LOR';
  public setNumber: string = '86';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Machop';
  public fullName: string = 'Machop LOR';
}
