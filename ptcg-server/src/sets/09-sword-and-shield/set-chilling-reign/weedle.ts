import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class WeedleCRE extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.SINGLE_STRIKE];
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Pierce',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'CRE';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Weedle';
  public fullName: string = 'Weedle CRE';
}
