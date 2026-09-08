import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pancham extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Light Punch',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Confront',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '71';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pancham';
  public fullName: string = 'Pancham BKP';
}
