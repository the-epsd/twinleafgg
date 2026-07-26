import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chimchar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Flare',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public set: string = 'PLS';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chimchar';
  public fullName: string = 'Chimchar PLS';
}
