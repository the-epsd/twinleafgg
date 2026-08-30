import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: D }];
  public retreat = [C];

  public attacks = [{
    name: 'Spooky Shot',
    cost: [P, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LTR';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus LTR';
}
