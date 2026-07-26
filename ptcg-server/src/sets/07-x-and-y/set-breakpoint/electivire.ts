import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electivire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Electabuzz';
  public cardType: CardType = L;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Knuckle Punch',
    cost: [C, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Electroslug',
    cost: [L, L, C],
    damage: 90,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electivire';
  public fullName: string = 'Electivire BKP';
}
