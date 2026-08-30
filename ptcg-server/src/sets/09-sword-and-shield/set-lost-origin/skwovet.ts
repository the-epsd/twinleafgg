import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Skwovet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [C];
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public setNumber: string = '150';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Skwovet';
  public fullName: string = 'Skwovet LOR 150';
}
