import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Shelmet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.FUSION_STRIKE];
  public cardType: CardType = G;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Spit Beam',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '13';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shelmet';
  public fullName: string = 'Shelmet FST';
}
