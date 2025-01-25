import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Slash',
    cost: [D, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'UNM';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel UNM';
  public setNumber: string = '131';
  public cardImage: string = 'assets/cardback.png';
}