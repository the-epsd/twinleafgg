import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Misdreavus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Mumble',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'ASR';
  public setNumber: string = '58';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Misdreavus';
  public fullName: string = 'Misdreavus ASR 58';
}
