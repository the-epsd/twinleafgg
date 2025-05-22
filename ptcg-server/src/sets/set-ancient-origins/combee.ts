import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Combee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Bug Bite',
    cost: [G],
    damage: 10,
    text: ''
  }];

  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Combee';
  public fullName: string = 'Combee AOR';
}
