import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from "../../../game/store/prefabs/prefabs";

/** #32 — Scurry About */
export class Pikachu32 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Scurry About',
    cost: [C],
    damage: 0,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '32';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 32';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scurry About
    if (AFTER_ATTACK(effect, 0, this)) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    return state;
  }
}
