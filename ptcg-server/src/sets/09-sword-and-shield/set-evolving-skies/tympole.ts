import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tympole extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole EVS';
}
