import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';

export class Clamperl extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.FUSION_STRIKE];
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Bursting Bubble',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '65';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Clamperl';
  public fullName: string = 'Clamperl FST 65';
}
