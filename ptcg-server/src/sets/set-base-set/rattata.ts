import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Rattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 30;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [ ];

  public attacks = [{
    name: 'Bite',
    cost: [ C ],
    damage: 20,
    text: ''
  }];

  public set: string = 'BS';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rattata';
  public fullName: string = 'Rattata BS';
}
