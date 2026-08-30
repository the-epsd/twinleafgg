import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Vulpix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [R];
  public hp: number = 70;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Live Coal',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '28';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vulpix';
  public fullName: string = 'Vulpix FST 28';
}
