import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PowerType } from "../../../game";
import { DealDamageEffect } from "../../../game/store/effects/attack-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_ABILITY_BLOCKED } from "../../../game/store/prefabs/prefabs";

/** #28 — Lonely Gaze + Pika Ball */
export class Pikachu28 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F }];
  public retreat = [C];
  public powers = [{
    name: 'Lonely Gaze',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, attacks used by your opponent\'s Active Pokémon do 20 less damage (before applying Weakness and Resistance).'
  }];
  public attacks = [{
    name: 'Pika Ball',
    cost: [L, C],
    damage: 20,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 28';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lonely Gaze
    if (effect instanceof DealDamageEffect) {
      const owner = StateUtils.findOwner(state, StateUtils.findCardList(state, this));
      if (!StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, owner);
      if (effect.player !== opponent || effect.source !== opponent.active) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }
}
