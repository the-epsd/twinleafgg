import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #27 — Nap */
export class Pikachu27 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C, C, C];
  public attacks = [{
    name: 'Nap',
    cost: [C],
    damage: 0,
    text: 'Heal 30 damage from this Pokémon.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 27';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
    }
    return state;
  }
}
