import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';

export class Marill extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Rollout',
    cost: [C],
    damage: 10,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public name: string = 'Marill';
  public fullName: string = 'Marill SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
}