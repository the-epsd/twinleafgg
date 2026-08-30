import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pancham extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punch',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pancham';
  public fullName: string = 'Pancham CEC';
}
