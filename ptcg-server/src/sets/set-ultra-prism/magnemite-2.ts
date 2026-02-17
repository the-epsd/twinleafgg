import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../game';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Magnemite2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Solid Unit',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, prevent all damage done to this Pokémon by attacks (both yours and your opponent\'s).'
  }];

  public attacks = [
    {
      name: 'Ram',
      cost: [M, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '81';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite UPR 81';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Solid Unit (passive - prevent all damage on bench)
    // Ref: set-crimson-invasion/regice.ts (Iceberg Shield - AbstractAttackEffect prevention)
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Only works on bench
      if (player.active === effect.target) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Only works on bench
      if (player.active === effect.target) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }
}
