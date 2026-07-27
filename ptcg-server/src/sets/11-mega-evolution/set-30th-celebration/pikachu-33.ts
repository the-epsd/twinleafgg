import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PowerType } from "../../../game";
import { AbstractAttackEffect } from "../../../game/store/effects/attack-effects";
import { Effect } from "../../../game/store/effects/effect";
import { IS_ABILITY_BLOCKED } from "../../../game/store/prefabs/prefabs";

/** #33 — Keep Hidden + Tiny Charge */
export class Pikachu33 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [C];
  public powers = [{
    name: 'Keep Hidden',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, prevent all damage from and effects of attacks from your opponent\'s Pokémon done to this Pokémon.'
  }];
  public attacks = [{
    name: 'Tiny Charge',
    cost: [L],
    damage: 10,
    text: ''
  }];
  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Pikachu';
  public fullName: string = 'Pikachu 30C 33';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Keep Hidden
    if (effect instanceof AbstractAttackEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);

      if (effect.target === owner.active) {
        return state;
      }

      if (effect.player === owner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}
