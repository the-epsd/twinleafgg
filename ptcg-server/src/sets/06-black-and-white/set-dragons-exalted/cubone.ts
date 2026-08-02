import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cubone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Beat',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '60';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cubone';
  public fullName: string = 'Cubone DRX';
}
