import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Nosepass extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Rock Throw',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'DRX';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nosepass';
  public fullName: string = 'Nosepass DRX';
}
