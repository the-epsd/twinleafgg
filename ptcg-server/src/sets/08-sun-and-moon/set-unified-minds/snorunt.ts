import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Snorunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Icicle',
    cost: [W],
    damage: 20,
    text: ''
  }];

  public set: string = 'UNM';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Snorunt';
  public fullName: string = 'Snorunt UNM';
}
