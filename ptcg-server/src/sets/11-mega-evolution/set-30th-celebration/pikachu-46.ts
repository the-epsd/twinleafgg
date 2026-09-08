import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { RemoveSpecialConditionsEffect } from "../../../game/store/effects/attack-effects";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

/** #46 — Get Some Air + Smash Kick */
export class Pikachu46 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public attacks = [{
    name: 'Get Some Air',
    cost: [C],
    damage: 0,
    text: 'This Pokémon recovers from all Special Conditions.'
  },
  {
    name: 'Smash Kick',
    cost: [C, C],
    damage: 20,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '46';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 46';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Get Some Air
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
      removeSpecialCondition.target = effect.player.active;
      state = store.reduceEffect(state, removeSpecialCondition);
    }
    return state;
  }
}
