import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 160;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Heavy Impact',
    cost: [C, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '206';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax FST 206';
}
