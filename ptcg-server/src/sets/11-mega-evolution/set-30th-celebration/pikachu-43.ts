import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND } from "../../../game/store/prefabs/attack-effects";
import { ADD_SLEEP_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #43 — Tropical Vibes */
export class Pikachu43 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Tropical Vibes',
    cost: [C, C],
    damage: 0,
    text: 'This Pokémon is now Asleep. Draw cards until you have 6 cards in your hand.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 43';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tropical Vibes
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
      DRAW_CARDS_UNTIL_YOU_HAVE_X_CARDS_IN_HAND(6, effect, state);
    }
    return state;
  }
}
