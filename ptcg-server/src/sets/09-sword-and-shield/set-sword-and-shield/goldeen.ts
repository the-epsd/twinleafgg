import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Goldeen extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'SSH';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Goldeen';
  public fullName: string = 'Goldeen SSH';
}
