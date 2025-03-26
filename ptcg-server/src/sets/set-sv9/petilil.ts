import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Petilil extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Leaf Step',
    cost: [ G, C ],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Petilil';
  public fullName: string = 'Petilil SV9';
}