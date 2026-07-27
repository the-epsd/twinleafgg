import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #36 — Slight Intrusion */
export class Pikachu36 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C, C];
  public attacks = [{
    name: 'Slight Intrusion',
    cost: [L, C],
    damage: 40,
    text: 'This Pokémon also does 10 damage to itself.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 36';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slight Intrusion
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }
    return state;
  }
}
