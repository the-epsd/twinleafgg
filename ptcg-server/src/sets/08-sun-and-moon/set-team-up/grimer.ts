import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Grimer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Pound',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'TEU';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grimer';
  public fullName: string = 'Grimer TEU';
}
