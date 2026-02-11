import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { UseAttackEffect } from '../../game/store/effects/game-effects';
import { IS_ABILITY_BLOCKED, NEXT_TURN_ATTACK_BONUS } from '../../game/store/prefabs/prefabs';
// Energy type constants (P, C, D, F) are assumed to be globally available as in other SV11B cards

export class Meloettaex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardTag = [CardTag.POKEMON_ex];
  public cardType = P;
  public hp: number = 200;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Live Debut',
    powerType: PowerType.ABILITY,
    text: 'If you go first, this Pokémon can attack on your first turn.'
  }];

  public attacks = [{
    name: 'Echoed Voice',
    cost: [P],
    damage: 30,
    text: 'During your next turn, this Pokémon\'s Echoed Voice attack does 80 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'BLK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Meloetta ex';
  public fullName: string = 'Meloetta ex SV11B';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseAttackEffect && effect.player.active.cards.includes(this) && state.turn === 1) {
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }
      effect.attack.canUseOnFirstTurn = true;
    }

    // Refs: set-boundaries-crossed/meloetta.ts (Echoed Voice), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BONUS)
    NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 80,
      bonusMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER,
      clearMarker: this.NEXT_TURN_MORE_DAMAGE_MARKER_2
    });
    return state;
  }
}
