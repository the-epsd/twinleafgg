import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Primeape extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Mankey';
  public cardType: CardType[] = [F];
  public hp: number = 110;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Corkscrew Punch',
    cost: [C, C],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'PBL';
  public setNumber: string = '43';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Primeape';
  public fullName: string = 'Primeape M5';
}
