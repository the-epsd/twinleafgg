import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];

  public attacks = [{
    name: 'Speed Dive',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Yanma';
  public fullName: string = 'Yanma ASR';
}
