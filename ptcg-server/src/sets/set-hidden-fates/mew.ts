import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Mew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Psyshot',
    cost: [P, P],
    damage: 50,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '32';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mew';
  public fullName: string = 'Mew HIF';
}
