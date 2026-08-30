import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #29 — Find a Friend */
export class Pikachu29 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Find a Friend',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 29';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Find a Friend
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player, {}, { min: 0, max: 1 });
    }
    return state;
  }
}
