import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Beam',
    cost: [P, P],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '61';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum JTG';
}
