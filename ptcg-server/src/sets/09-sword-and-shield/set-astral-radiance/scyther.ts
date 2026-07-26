import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Scyther extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Blinding Scythe',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scyther';
  public fullName: string = 'Scyther ASR 4';
}
