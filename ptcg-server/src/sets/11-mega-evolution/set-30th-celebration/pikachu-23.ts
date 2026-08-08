import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from "../../../game/store/prefabs/attack-effects";
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #23 — Thunder Shock (Paralyze) */
export class Pikachu23 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Shock',
    cost: [L, C],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Thunder Shock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }
    return state;
  }
}
