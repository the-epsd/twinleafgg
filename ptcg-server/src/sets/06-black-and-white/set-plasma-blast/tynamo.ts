import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tynamo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 30;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Razor Fin',
    cost: [L],
    damage: 20,
    text: ''
  }];

  public set: string = 'PLB';
  public setNumber: string = '31';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tynamo';
  public fullName: string = 'Tynamo PLB';
}
