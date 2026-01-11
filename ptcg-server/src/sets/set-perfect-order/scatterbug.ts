import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Scatterbug extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Scatterbug';
  public fullName: string = 'Scatterbug M3';
}