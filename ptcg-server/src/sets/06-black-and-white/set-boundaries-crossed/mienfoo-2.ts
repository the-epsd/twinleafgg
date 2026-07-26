import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Mienfoo2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [F],
    damage: 20,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mienfoo';
  public fullName: string = 'Mienfoo BCR 87';
}
