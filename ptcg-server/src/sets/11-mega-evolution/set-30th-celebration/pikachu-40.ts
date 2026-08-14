import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { DEFENDING_POKEMON_WEAKNESS_IS_NOW } from "../../../game/store/prefabs/effect-of-attack-prefabs";

/** #40 — Overwriting Bolt */
export class Pikachu40 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Overwriting Bolt',
    cost: [L],
    damage: 10,
    text: 'The Defending Pokémon\'s Weakness is now [L] until the end of your next turn. (Apply Weakness as ×2.)'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 40';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Overwriting Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DEFENDING_POKEMON_WEAKNESS_IS_NOW(store, state, effect, this, CardType.LIGHTNING);
    }
    return state;
  }
}
