import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Electroslug',
    cost: [L, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'DRI';
  public setNumber: string = '68';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz DRI';
}
