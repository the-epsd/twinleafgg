import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #52 — Angry Bolt */
export class Pikachu52 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Angry Bolt',
    cost: [L],
    damage: 10,
    damageCalculation: '+',
    text: 'This attack does 10 more damage for each damage counter on this Pokémon.'
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '52';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 52';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Angry Bolt
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const counters = Math.floor(effect.source.damage / 10);
      effect.damage += 10 * counters;
    }
    return state;
  }
}
