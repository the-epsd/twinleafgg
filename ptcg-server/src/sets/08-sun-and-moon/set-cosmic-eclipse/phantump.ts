import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Phantump extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mumble',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Spooky Shot',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Phantump';
  public fullName: string = 'Phantump CEC';
}
