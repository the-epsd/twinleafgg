import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Dratini extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [{ type: Y }];
  public retreat = [C, C];

  public powers = [{
    name: 'Defensive Scales',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s attacks, except damage, done to this Pokémon.'
  }];

  public attacks = [{
    name: 'Rain Splash',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '117';
  public set = 'TEU';
  public name: string = 'Dratini';
  public fullName: string = 'Dratini TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        // if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {

        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        effect.preventDefault = true;
      }
    }
    return state;
  }
}

