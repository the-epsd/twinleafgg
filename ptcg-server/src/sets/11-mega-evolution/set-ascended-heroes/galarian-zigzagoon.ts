import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class GalarianZigzagoon extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [D];
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [D],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '130';
  public name: string = 'Galarian Zigzagoon';
  public fullName: string = 'Galarian Zigzagoon ASC';
}
