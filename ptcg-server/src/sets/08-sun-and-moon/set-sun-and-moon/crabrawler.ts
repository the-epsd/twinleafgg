import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Crabrawler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Crabhammer',
    cost: [F, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'SUM';
  public setNumber: string = '72';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crabrawler';
  public fullName: string = 'Crabrawler SUM';
}
