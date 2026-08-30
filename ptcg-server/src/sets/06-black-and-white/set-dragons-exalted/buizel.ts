import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Buizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Wave Splash',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Buizel';
  public fullName: string = 'Buizel DRX';
}
