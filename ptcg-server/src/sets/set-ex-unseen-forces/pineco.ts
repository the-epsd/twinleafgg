import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Pineco extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Ram',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Pineco';
  public fullName: string = 'Pineco UF';
}