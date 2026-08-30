import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 120;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Land Crush',
    cost: [C, C, C, C],
    damage: 120,
    text: ''
  }];

  public set: string = 'LOT';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Onix';
  public fullName: string = 'Onix LOT';
}
