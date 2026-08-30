import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Dwebble extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bug Bite',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LTR';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dwebble';
  public fullName: string = 'Dwebble LTR';
}
