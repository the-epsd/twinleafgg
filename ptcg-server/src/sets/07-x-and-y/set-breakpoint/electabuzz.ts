import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Electabuzz extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Knuckle Punch',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '42';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Electabuzz';
  public fullName: string = 'Electabuzz BKP';
}
