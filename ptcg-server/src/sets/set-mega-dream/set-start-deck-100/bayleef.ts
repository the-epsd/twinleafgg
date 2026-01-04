import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Bayleef extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chikorita';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leaf Step',
    cost: [G, G],
    damage: 60,
    text: ''
  }];

  public regulationMark = 'I';
  public set: string = 'MC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Bayleef';
  public fullName: string = 'Bayleef MC';
}