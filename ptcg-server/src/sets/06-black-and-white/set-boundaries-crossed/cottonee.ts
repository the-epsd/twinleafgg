import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Cottonee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'BCR';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cottonee';
  public fullName: string = 'Cottonee BCR';
}
