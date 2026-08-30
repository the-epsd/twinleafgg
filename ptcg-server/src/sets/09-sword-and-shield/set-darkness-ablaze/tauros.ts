import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Tauros extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Horn Attack',
    cost: [C, C],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'D';
  public set: string = 'DAA';
  public setNumber: string = '134';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tauros';
  public fullName: string = 'Tauros DAA';
}
