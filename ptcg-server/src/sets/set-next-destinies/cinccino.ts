import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, COIN_FLIP_PROMPT, NEXT_TURN_ATTACK_BONUS } from '../../game/store/prefabs/prefabs';

export class Cinccino extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Minccino';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Smooth Coat',
    powerType: PowerType.ABILITY,
    text: 'If any damage is done to this Pokémon by attacks, flip a coin. If heads, prevent that damage.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [C, C, C],
    damage: 50,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'NXD';
  public setNumber: string = '85';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cinccino';
  public fullName: string = 'Cinccino NXD';

  public readonly ECHOED_VOICE_MARKER = 'ECHOED_VOICE_MARKER';
  public readonly ECHOED_VOICE_CLEAR_MARKER = 'ECHOED_VOICE_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smooth Coat - flip coin to prevent damage
    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.damage <= 0) {
        return state;
      }

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage = 0;
        }
      });
    }

    // Echoed Voice
    // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 50,
      bonusMarker: this.ECHOED_VOICE_MARKER,
      clearMarker: this.ECHOED_VOICE_CLEAR_MARKER
    });

    return state;
  }
}
