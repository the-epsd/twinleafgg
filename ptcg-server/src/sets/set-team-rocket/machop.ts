import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Machop extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Kick',
    cost: [F, C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Machop';
  public fullName: string = 'Machop TR';
}