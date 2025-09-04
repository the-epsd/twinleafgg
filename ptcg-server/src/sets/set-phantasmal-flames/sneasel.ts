import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Dig Claws',
    cost: [D],
    damage: 10,
    text: ''
  },
  {
    name: 'Scratch',
    cost: [D, D],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'M2';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel M2';
}