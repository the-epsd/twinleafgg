import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class JangmoO2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [N];
  public hp: number = 70;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [F],
    damage: 10,
    text: ''
  },
  {
    name: 'Dragon Headbutt',
    cost: [L, F, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'CEC';
  public setNumber: string = '161';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jangmo-o';
  public fullName: string = 'Jangmo-o CEC 161';
}
