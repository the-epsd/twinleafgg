import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Golbat extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Zubat';
  public regulationMark: string = 'F';
  public cardType: CardType = CardType.DARK;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [CardType.DARK],
    damage: 30,
    text: ''
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Golbat';
  public fullName: string = 'Golbat SIT';

}