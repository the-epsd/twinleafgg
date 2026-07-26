import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Chimchar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 40;
  public weakness = [{ type: W }];
  public retreat = [];

  public attacks = [{
    name: 'Flare',
    cost: [R],
    damage: 20,
    text: ''
  }];

  public set: string = 'UPR';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chimchar';
  public fullName: string = 'Chimchar UPR';
}
