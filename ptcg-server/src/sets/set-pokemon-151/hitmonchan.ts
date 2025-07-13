import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PowerType, StateUtils } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, EffectOfAbilityEffect } from '../../game/store/effects/game-effects';
import { BeginTurnEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Hitmonchan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 120;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Counterattack',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is damaged by an attack from your opponent\'s Pokémon(even if this Pokémon is Knocked Out), put 3 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Excited Punch',
    cost: [F, F],
    damage: 60,
    text: 'During your next turn, this Pokémon\'s Excited Punch attack does 60 more damage (before applying Weakness and Resistance).'
  }];

  public set: string = 'MEW';
  public regulationMark = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Hitmonchan';
  public fullName: string = 'Hitmonchan MEW';

  public readonly NEXT_TURN_MORE_DAMAGE_MARKER = 'NEXT_TURN_MORE_DAMAGE_MARKER';
  public readonly NEXT_TURN_MORE_DAMAGE_MARKER_2 = 'NEXT_TURN_MORE_DAMAGE_MARKER_2';
  public usedAttack: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this && state.phase === GamePhase.ATTACK) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = effect.player;
      if (player === opponent || player.active !== effect.target)
        return state;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, effect.source);
      store.reduceEffect(state, damageEffect);
      if (damageEffect.target) {
        damageEffect.target.damage += 30;
      }
    }

    // Check if the attack was used
    if (effect instanceof AttackEffect) {
      this.usedAttack = true;
    }

    if (effect instanceof BeginTurnEffect) {
      if (this.usedAttack) {
        this.usedAttack = false;
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (!this.usedAttack) {
        this.usedAttack = false;
        effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
        effect.player.marker.removeMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER_2, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      // Check marker
      if (effect.player.marker.hasMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this)) {
        effect.damage += 60;
      }
      effect.player.marker.addMarker(this.NEXT_TURN_MORE_DAMAGE_MARKER, this);
    }

    return state;
  }

}
