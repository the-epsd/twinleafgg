import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vulpix';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Supernatural Flames',
    cost: [R, C],
    damage: 70,
    text: ''
  }];

  public regulationMark = 'E';
  public set: string = 'FST';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales FST 30';
}
