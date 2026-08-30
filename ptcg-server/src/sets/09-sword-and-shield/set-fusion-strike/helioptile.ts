import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Helioptile extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Electro Ball',
    cost: [L, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '98';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Helioptile';
  public fullName: string = 'Helioptile FST 98';
}
