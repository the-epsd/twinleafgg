import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sneasel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [{
    name: 'Claw Slash',
    cost: [D],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'PRE';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sneasel';
  public fullName: string = 'Sneasel PRE';
}
