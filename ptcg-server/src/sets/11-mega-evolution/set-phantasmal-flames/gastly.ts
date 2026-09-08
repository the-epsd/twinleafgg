import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Petty Grudge',
    cost: [D],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '54';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly MBG';
}
