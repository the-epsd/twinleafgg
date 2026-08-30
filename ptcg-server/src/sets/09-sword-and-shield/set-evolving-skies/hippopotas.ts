import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Hippopotas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [F, C],
    damage: 30,
    text: ''
  },
  {
    name: 'Mud Shot',
    cost: [F, F, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public setNumber: string = '84';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hippopotas';
  public fullName: string = 'Hippopotas EVS';
}
