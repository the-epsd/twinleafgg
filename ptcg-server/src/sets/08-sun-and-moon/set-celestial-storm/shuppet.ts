import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Shuppet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Headbutt',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Will-o-wisp',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CES';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shuppet';
  public fullName: string = 'Shuppet CES';
}
