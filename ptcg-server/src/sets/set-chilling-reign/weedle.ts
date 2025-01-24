import { CardTag, CardType, PokemonCard, Stage } from '../../game';

export class WeedleCRE extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags: CardTag[] = [CardTag.SINGLE_STRIKE];

  public cardType: CardType = CardType.GRASS;

  public hp: number = 40;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'CRE';

  public setNumber = '1';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'E';

  public name = 'Weedle';

  public fullName = 'Weedle CRE';

  public attacks = [{ name: 'Pierce', cost: [CardType.GRASS], damage: 20, text: '' }];
}