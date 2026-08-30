import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Gossifleur2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Leafage',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'SHF';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gossifleur';
  public fullName: string = 'Gossifleur SHF 14';
}
