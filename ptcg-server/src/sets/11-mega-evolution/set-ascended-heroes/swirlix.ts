import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Swirlix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [P],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Swirlix';
  public fullName: string = 'Swirlix ASC';
}
