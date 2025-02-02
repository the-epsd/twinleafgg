import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';

export class Turtwig extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 80;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Solid Shell',
    powerType: PowerType.ABILITY,
    text: 'This Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Leafage',
    cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 30,
    text: ''
  }];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '10';

  public name: string = 'Turtwig';

  public fullName: string = 'Turtwig TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Reduce damage by 20
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      effect.damage = Math.max(0, effect.damage - 20);
    }

    return state;
  }

}
