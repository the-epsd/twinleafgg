import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Crabrawler extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Vise Grip',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Crabhammer',
    cost: [C, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Crabrawler';
  public fullName: string = 'Crabrawler SCR';
}
