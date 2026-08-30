import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cherubi extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Leafage',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'BRS';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cherubi';
  public fullName: string = 'Cherubi BRS';
}
