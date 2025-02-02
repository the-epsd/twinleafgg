import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Inkay extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.PSYCHIC;
  public hp: number = 50;
  public weakness = [{ type: CardType.PSYCHIC }];
  public retreat = [CardType.COLORLESS];
  public tags = [ CardTag.RAPID_STRIKE ];
  public evolvesInto = 'Malamar';

  public attacks = [{
    name: 'Spinning Attack',
    cost: [CardType.PSYCHIC],
    damage: 20,
    text: ''
  }];

  public set: string = 'CRE';
  public name: string = 'Inkay';
  public fullName: string = 'Inkay CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '69';
}