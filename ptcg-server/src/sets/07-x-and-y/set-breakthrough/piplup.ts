import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Piplup extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [W, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Piplup';
  public fullName: string = 'Piplup BKT';
}
