import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';

export class Hippopotas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 90;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Tackle',
    cost: [C, C],
    damage: 20,
    text: ''
  },
  {
    name: 'Rolling Tackle',
    cost: [F, F, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'PRC';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hippopotas';
  public fullName: string = 'Hippopotas PRC';
}
