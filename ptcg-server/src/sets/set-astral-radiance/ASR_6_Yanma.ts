import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Yanma extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIRE }];

  public attacks = [{
    name: 'Speed Dive',
    cost: [CardType.GRASS],
    damage: 20,
    text: ''
  }];

  public set: string = 'ASR';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Yanma ASR';
  public name: string = 'Yanma';
  public setNumber: string = '6';

}