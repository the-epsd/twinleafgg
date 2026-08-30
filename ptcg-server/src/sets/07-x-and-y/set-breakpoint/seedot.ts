import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Seedot extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Seedot';
  public fullName: string = 'Seedot BKP';
}
