import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cranidos extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Unidentified Fossil';
  public cardType: CardType[] = [F];
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [F],
    damage: 30,
    text: ''
  },
  {
    name: 'Headstrike',
    cost: [F, F],
    damage: 50,
    text: ''
  }];

  public set: string = 'UPR';
  public setNumber: string = '64';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cranidos';
  public fullName: string = 'Cranidos UPR';
}
