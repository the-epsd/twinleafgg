import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Vice Grip',
    cost: [W],
    damage: 10,
    text: ''
  },
  {
    name: 'Crabhammer',
    cost: [W, W, W],
    damage: 50,
    text: ''
  }];

  public set: string = 'PHF';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Krabby';
  public fullName: string = 'Krabby PHF';
}
