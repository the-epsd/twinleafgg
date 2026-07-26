import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Shinx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 40;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Gnaw',
    cost: [L],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'BRS';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Shinx';
  public fullName: string = 'Shinx BRS 49';
}
