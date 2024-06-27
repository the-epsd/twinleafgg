import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Flittle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 30;
  public weakness = [{ type: CardType.DARK }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [];

  public attacks = [{
    name: 'Ram',
    cost: [CardType.PSYCHIC],
    damage: 10,
    text: ''
  }];

  public set: string = 'SVI';
  public regulationMark: string = 'G';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flittle';
  public fullName: string = 'Flittle SVI';
}