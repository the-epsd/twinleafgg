import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Toxtricity extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Toxel';
  public hp: number = 130;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Mach Bolt',
    cost: [L, C],
    damage: 80,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '59';
  public name: string = 'Toxtricity';
  public fullName: string = 'Toxtricity 30C';
}
