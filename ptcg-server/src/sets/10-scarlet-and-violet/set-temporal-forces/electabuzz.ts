import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [L];
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Chop',
    cost: [L],
    damage: 20,
    text: ''
  },
  {
    name: 'Electric Punch',
    cost: [L, C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TEF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz TEF';
}
