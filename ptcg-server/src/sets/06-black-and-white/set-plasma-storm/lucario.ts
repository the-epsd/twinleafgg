import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lucario extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Riolu';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Kick',
    cost: [F, C],
    damage: 10,
    text: ''
  },
  {
    name: 'Mach Cross',
    cost: [F, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'PLS';
  public setNumber: string = '77';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lucario';
  public fullName: string = 'Lucario PLS';
}
