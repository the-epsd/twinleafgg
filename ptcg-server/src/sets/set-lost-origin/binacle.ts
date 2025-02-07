import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Binacle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Slash',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOR';
  public setNumber: string = '106';
  public regulationMark = 'F';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Binacle';
  public fullName: string = 'Binacle LOR';
}