import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cyndaquil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 60;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Beat',
    cost: [R],
    damage: 10,
    text: ''
  },
  {
    name: 'Flare',
    cost: [R, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'HS';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cyndaquil';
  public fullName: string = 'Cyndaquil HS';
}
