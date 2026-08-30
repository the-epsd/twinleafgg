import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Geodude extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rollout',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Light Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '135';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Geodude';
  public fullName: string = 'Geodude FST 135';
}
