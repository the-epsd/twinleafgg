import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class AlolanRattata extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 40;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Gnaw',
    cost: [],
    damage: 20,
    text: ''
  }];

  public set: string = 'SUM';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Rattata';
  public fullName: string = 'Alolan Rattata SUM';
}
