import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Blitzle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 70;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public evolvesInto = 'Zebstrika';
  public attacks = [{
    name: 'Flop',
    cost: [CardType.LIGHTNING],
    damage: 10,
    text: ''
  }, {
    name: 'Zap Kick',
    cost: [CardType.LIGHTNING, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'LOT';
  public name: string = 'Blitzle';
  public fullName: string = 'Blitzle LOT';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
}