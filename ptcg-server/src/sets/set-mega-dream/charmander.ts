import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Fire Claws',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Charmander';
  public fullName: string = 'Charmander M2a';
}