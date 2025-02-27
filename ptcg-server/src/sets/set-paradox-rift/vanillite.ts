import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';

export class Vanillite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: M }];
  public retreat = [ C ];

  public attacks = [{
    name: 'Chilly',
    cost: [W, W],
    damage: 40,
    text: ''
  }];
  
  public set: string = 'PAR';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Vanillite';
  public fullName: string = 'Vanillite PAR';
}