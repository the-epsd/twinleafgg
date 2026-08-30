import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Ekans2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ekans';
  public fullName: string = 'Ekans HIF 26';
}
