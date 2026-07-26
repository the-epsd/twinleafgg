import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Charcadet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Heat Blast',
    cost: [R, R, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'SVI';
  public setNumber: string = '40';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charcadet';
  public fullName: string = 'Charcadet SVI';
}
