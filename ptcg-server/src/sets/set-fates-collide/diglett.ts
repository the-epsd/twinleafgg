import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Diglett extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 40;
  public weakness = [{ type: G }];
  public retreat = [];

  public attacks = [{
    name: 'Ram',
    cost: [F],
    damage: 10,
    text: ''
  }];

  public set = 'FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name = 'Diglett';
  public fullName = 'Diglett FCO';

}