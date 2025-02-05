import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Glimmet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rock Throw',
    cost: [F],
    damage: 20,
    text: ''
  }];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public setNumber: string = '125';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Glimmet';
  public fullName: string = 'Glimmet PAL';

}