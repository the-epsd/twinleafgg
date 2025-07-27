import { PokemonCard, Stage, CardType } from '../../game';

export class Pignite extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Tepig';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Combustion',
    cost: [R],
    damage: 30,
    text: ''
  }, {
    name: 'Heat Crash',
    cost: [R, R, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public setNumber = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pignite';
  public fullName: string = 'Pignite SV11W';

}