import { PokemonCard } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';

export class StevensBeldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags: CardTag[] = [CardTag.STEVENS];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{ name: 'Metal Slash', cost: [M, C], damage: 30, text: '' }];

  public regulationMark: string = 'I';
  public set: string = 'SVOD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Steven\'s Beldum';
  public fullName: string = 'Steven\'s Beldum SVOD';

}
