import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class Taillow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '156';
  public name: string = 'Taillow';
  public fullName: string = 'Taillow DRI';
  public regulationMark = 'I';
}