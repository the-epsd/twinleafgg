import { CardType, PokemonCard, Stage } from '../../../game';

export class Nidorina extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nidoran ♀';
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [D, C],
    damage: 60,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Nidorina';
  public fullName: string = 'Nidorina M6';
}
