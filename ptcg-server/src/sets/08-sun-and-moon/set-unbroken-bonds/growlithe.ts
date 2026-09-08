import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Growlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Live Coal',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Combustion',
    cost: [R, R],
    damage: 30,
    text: ''
  }];

  public set: string = 'UNB';
  public setNumber: string = '21';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Growlithe';
  public fullName: string = 'Growlithe UNB';
}
