import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Blitzle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Flop',
    cost: [L],
    damage: 10,
    text: ''
  },
  {
    name: 'Zap Kick',
    cost: [L, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOT';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Blitzle';
  public fullName: string = 'Blitzle LOT';
}
