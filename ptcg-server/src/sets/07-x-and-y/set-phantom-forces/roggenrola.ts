import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Roggenrola extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [F, F],
    damage: 30,
    text: ''
  }];

  public set: string = 'PHF';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Roggenrola';
  public fullName: string = 'Roggenrola PHF';
}
