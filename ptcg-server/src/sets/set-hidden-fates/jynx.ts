import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Jynx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Slap',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Lovely Kiss',
    cost: [P, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jynx';
  public fullName: string = 'Jynx HIF';
}
