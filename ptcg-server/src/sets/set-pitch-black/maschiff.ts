import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Maschiff extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bite',
    cost: [D, D],
    damage: 40,
    text: '',
  }];

  public set: string = 'M5';
  public setNumber: string = '55';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Maschiff';
  public fullName: string = 'Maschiff M5';
}
