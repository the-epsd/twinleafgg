import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Snorlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Incredible Snore',
    cost: [C, C, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snorlax';
  public fullName: string = 'Snorlax HIF';
}
