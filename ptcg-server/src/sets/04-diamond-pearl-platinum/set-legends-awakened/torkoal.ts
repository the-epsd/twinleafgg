import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';

export class Torkoal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'White Smoke',
    powerType: PowerType.POKEBODY,
    text: 'As long as Torkoal is your Active Pokémon, prevent all effects, including damage, done to your Benched Pokémon by your opponent\'s attacks.'
  }];

  public attacks = [{
    name: 'Black Soot',
    cost: [R, C],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Burned and Paralyzed.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Torkoal';
  public fullName: string = 'Torkoal LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // White Smoke
    if (effect instanceof AbstractAttackEffect) {
      const defendingPlayer = StateUtils.findOwner(state, effect.target);
      const attackingPlayer = StateUtils.findOwner(state, effect.source);

      if (attackingPlayer === defendingPlayer) {
        return state;
      }
      if (defendingPlayer.active.getPokemonCard() !== this) {
        return state;
      }
      if (!defendingPlayer.bench.includes(effect.target)) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, defendingPlayer, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Black Soot
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
