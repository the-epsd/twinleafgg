import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Salandit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Live Coal',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Combustion',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'UPR';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Salandit';
  public fullName: string = 'Salandit UPR';
}
