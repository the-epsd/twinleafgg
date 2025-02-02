import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Wingull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public regulationMark: string = 'G';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 70;
  public weakness = [{ type: CardType.LIGHTNING }];
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Gust',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'PAL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '158';
  public name: string = 'Wingull';
  public fullName: string = 'Wingull PAL';

}