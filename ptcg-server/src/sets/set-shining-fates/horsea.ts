import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 40;
  public weakness = [{ type: L }];
  public retreat = [];

  public attacks = [{
    name: 'Water Gun',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'SHF';
  public setNumber: string = '20';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea SHF';
}
