import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Sewaddle2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'LTR';
  public setNumber: string = '10';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sewaddle';
  public fullName: string = 'Sewaddle LTR 10';
}
