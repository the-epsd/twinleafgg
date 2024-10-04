import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.WATER;
  public hp: number = 60;
  public retreat = [CardType.COLORLESS];
  public weakness = [{ type: CardType.GRASS }];

  public attacks = [{
    name: 'Headache',
    cost: [CardType.WATER],
    damage: 20,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck HIF';


}