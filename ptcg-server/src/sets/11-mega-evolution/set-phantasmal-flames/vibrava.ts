import { PokemonCard, Stage } from '../../../game';
import { CardType } from '../../../game/store/card/card-types';

export class Vibrava extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Trapinch';
  public hp: number = 90;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Super Vibration',
    cost: [F, F],
    damage: 60,
    text: '',
  }];

  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Vibrava';
  public fullName: string = 'Vibrava PFL';
}