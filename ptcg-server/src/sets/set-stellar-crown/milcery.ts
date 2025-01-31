import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Milcery extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Mumble',
    cost: [P],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Milcery';
  public fullName: string = 'Milcery SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
}