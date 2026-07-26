import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Super Vibration',
    cost: [F, F],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava PFL';
}
