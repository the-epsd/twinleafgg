import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Caterpie extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Caterpie';
  public fullName: string = 'Caterpie HIF';
}
