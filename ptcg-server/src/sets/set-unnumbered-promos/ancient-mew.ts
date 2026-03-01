import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';

export class AncientMew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 30;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Psyche',
    cost: [P, P],
    damage: 40,
    text: ''
  }];

  public set: string = 'UP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'Ancient Mew';
  public name: string = 'Ancient Mew';
  public fullName: string = 'Ancient Mew UP';
}