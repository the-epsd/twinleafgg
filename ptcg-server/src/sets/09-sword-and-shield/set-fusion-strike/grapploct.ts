import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Grapploct extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Clobbopus';
  public cardType: CardType[] = [F];
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Lunge Out',
    cost: [F, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Magnum Punch',
    cost: [F, C, C],
    damage: 90,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '153';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grapploct';
  public fullName: string = 'Grapploct FST 153';
}
