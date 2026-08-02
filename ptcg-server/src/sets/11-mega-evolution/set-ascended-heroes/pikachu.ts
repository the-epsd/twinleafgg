import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Pikachu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Smack',
    cost: [L],
    damage: 10,
    text: ''
  },
  {
    name: 'Tiny Bolt',
    cost: [L, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu ASC';
}
