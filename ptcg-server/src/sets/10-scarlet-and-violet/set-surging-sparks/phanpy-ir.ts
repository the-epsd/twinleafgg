import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Headbutt',
    cost: [F],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '205';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Phanpy';
  public fullName: string = 'Phanpy SSP';
}
