import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Riolu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Jab',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Low Kick',
    cost: [F, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu SVI';
}
