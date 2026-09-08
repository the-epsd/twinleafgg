import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Ralts extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 60;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mumble',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Magical Shot',
    cost: [Y, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'AOR';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ralts';
  public fullName: string = 'Ralts AOR';
}
