import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { DRAW_CARDS, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #45 — Nighttime Stroll + Static Shock */
export class Pikachu45 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Nighttime Stroll',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Static Shock',
    cost: [L, C],
    damage: 20,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 45';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Nighttime Stroll
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }
    return state;
  }
}
