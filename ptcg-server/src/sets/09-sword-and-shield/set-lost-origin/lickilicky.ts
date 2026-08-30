import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Lickilicky extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lickitung';
  public cardType: CardType[] = [C];
  public hp: number = 140;
  public weakness = [{ type: F }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Tongue Slap',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Heavy Impact',
    cost: [C, C, C, C],
    damage: 130,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '139';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lickilicky';
  public fullName: string = 'Lickilicky LOR 139';
}
