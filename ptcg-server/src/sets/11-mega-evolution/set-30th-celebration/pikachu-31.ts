import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";

/** #31 — Gnaw (free retreat) */
export class Pikachu31 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [];
  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 31';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }
}
