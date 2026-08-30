import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Floragato extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sprigatito';
  public hp: number = 90;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [C],
    damage: 20,
    text: ''
  },
  {
    name: 'Leaf Step',
    cost: [G, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Floragato';
  public fullName: string = 'Floragato SVI';
}
