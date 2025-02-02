import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Riolu extends PokemonCard {
  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Jab',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  },
  {
    name: 'Low Kick',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];

  public set: string = 'SVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '112';
  public name: string = 'Riolu';
  public fullName: string = 'Riolu SVI';
}