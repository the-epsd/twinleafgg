import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Krabby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Stampede',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Vice Grip',
    cost: [W, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '46';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Krabby';
  public fullName: string = 'Krabby UNB';
}
