import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cosmog extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 40;
  public weakness = [{ type: P }];
  public retreat = [];

  public attacks = [{
    name: 'Splash',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cosmog';
  public fullName: string = 'Cosmog UNM';
}
