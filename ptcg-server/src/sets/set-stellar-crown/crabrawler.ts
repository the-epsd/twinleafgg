import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Crabrawler extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    { name: 'Vise Grip', cost: [CardType.COLORLESS, CardType.COLORLESS], damage: 20, text: '' },
    { name: 'Crabhammer', cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS], damage: 50, text: '' }
  ];

  public set: string = 'SCR';

  public name: string = 'Crabrawler';

  public fullName: string = 'Crabrawler SCR';

  public setNumber: string = '87';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

}