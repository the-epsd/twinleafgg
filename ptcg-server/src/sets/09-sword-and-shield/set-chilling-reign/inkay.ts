import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Inkay extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [P],
    damage: 20,
    text: ''
  }];

  public set: string = 'CRE';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Inkay';
  public fullName: string = 'Inkay CRE';
}
