import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BeginTurnEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
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

  public usedAttack: boolean = false;
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseAttackEffect && effect.player.active.cards.includes(this) && state.turn === 1) {
      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }
      effect.attack.canUseOnFirstTurn = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      this.usedAttack = true;
    }

    if (effect instanceof BeginTurnEffect && this.usedAttack) {
      this.usedAttack = false;
    }

    if (effect instanceof EndTurnEffect && !this.usedAttack) {
      this.usedAttack = false;
      REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
      REMOVE_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
      ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, effect.player, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Check marker
      if (HAS_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this)) {
        effect.damage += 80;
      }
      ADD_MARKER(this.NEXT_TURN_MORE_DAMAGE_MARKER, effect.player, this);
    }
    return state;
  }
}