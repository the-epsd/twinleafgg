import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Zubat extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'F';
  public cardType: CardType = CardType.DARK;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [];

  public attacks = [{
    name: 'Bite',
    cost: [CardType.DARK],
    damage: 10,
    text: ''
  }];

  public set: string = 'SIT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';
  public name: string = 'Zubat';
  public fullName: string = 'Zubat SIT';

}