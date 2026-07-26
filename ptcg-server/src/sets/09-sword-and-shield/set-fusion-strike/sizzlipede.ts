import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sizzlipede extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Ember',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sizzlipede';
  public fullName: string = 'Sizzlipede FST 46';
}
