import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from "../../../game/store/prefabs/effect-of-attack-prefabs";

/** #44 — Agility */
export class Pikachu44 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Agility',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark: string = 'J';

  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 44';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Agility
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }
    return state;
  }
}
