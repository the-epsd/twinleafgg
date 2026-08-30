import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Skrelp extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [D];
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Hook',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skrelp';
  public fullName: string = 'Skrelp M4';
}
