import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Staravia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Starly';
  public cardType: CardType[] = [C];
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '118';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Staravia';
  public fullName: string = 'Staravia BRS 118';
}
