import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pangoro extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pancham';
  public cardType: CardType = F;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Light Punch',
    cost: [C],
    damage: 40,
    text: ''
  },
  {
    name: 'Magnum Punch',
    cost: [C, C, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '120';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pangoro';
  public fullName: string = 'Pangoro CEC';
}
