import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Fletchling extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '151';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Fletchling';
  public fullName: string = 'Fletchling DAA';
}
