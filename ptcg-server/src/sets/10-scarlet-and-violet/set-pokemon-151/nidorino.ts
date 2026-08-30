import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nidorino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = '♂';
  public cardType: CardType[] = [D];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sharp Fang',
    cost: [D],
    damage: 30,
    text: ''
  },
  {
    name: 'Superpowered Horns',
    cost: [D, D, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nidorino';
  public fullName: string = 'Nidorino MEW';
}
