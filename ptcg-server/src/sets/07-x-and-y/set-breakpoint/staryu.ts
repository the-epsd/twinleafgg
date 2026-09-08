import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Staryu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 40;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [];

  public attacks = [{
    name: 'Smack',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public set: string = 'BKP';
  public setNumber: string = '25';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Staryu';
  public fullName: string = 'Staryu BKP';
}
