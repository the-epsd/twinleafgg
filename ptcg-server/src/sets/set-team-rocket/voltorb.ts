import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Speed Ball',
    cost: [L],
    damage: 20,
    text: ''
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb TR';
}