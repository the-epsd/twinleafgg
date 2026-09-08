import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Low Kick',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Fiery Punch',
    cost: [R, R, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '19';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar BRS 19';
}
