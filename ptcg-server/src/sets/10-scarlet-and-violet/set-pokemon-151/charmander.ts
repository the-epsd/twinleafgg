import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../../game/store/prefabs/prefabs';

export class Charmander extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Blazing Destruction',
    cost: [R],
    damage: 0,
    text: 'Discard a Stadium in play.',
    effect: DISCARD_A_STADIUM_CARD_IN_PLAY,
  },
  {
    name: 'Steady Firebreathing',
    cost: [R, R],
    damage: 30,
    text: '',
  }];

  public regulationMark = 'G';
  public set: string = 'MEW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Charmander';
  public fullName: string = 'Charmander MEW';
}
