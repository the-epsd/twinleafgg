import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Pidgeotto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Pidgey';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C, C],
    damage: 40,
    text: ''
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public setNumber: string = '163';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pidgeotto';
  public fullName: string = 'Pidgeotto OBF';
}
