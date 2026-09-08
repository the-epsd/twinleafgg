import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Low Kick',
    cost: [L, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Magnetic Blast',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '53';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz BCR';
}
