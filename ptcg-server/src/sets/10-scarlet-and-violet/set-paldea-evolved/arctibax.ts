import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Arctibax extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Frigibax';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Sharp Fin',
    cost: [W, C],
    damage: 40,
    text: ''
  },
  {
    name: 'Frost Smash',
    cost: [W, W, C],
    damage: 80,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'PAL';
  public setNumber: string = '59';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Arctibax';
  public fullName: string = 'Arctibax PAL';
}
