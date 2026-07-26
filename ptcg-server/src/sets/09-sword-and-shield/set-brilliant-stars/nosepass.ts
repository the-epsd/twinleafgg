import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nosepass';
  public fullName: string = 'Nosepass BRS 73';
}
