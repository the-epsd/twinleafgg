import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Farfetchd extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Leek Slap',
    cost: [C, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'HIF';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Farfetch\'d';
  public fullName: string = 'Farfetch\'d HIF';
}
