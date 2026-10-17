import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class GalarianLinoone extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Galarian Zigzagoon';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [D],
    damage: 20,
    text: ''
  },
{
    name: 'Claw Slash',
    cost: [D, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '131';
  public name: string = 'Galarian Linoone';
  public fullName: string = 'Galarian Linoone ASC';
}
