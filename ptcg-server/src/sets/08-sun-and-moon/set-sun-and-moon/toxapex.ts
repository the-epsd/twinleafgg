import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { MovedToActiveEffect, RetreatEffect } from '../../../game/store/effects/game-effects';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Toxapex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mareanie';
  public hp: number = 110;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Toxic Spikes',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent\'s Active Pokémon retreats, their new Active Pokémon is Poisoned.'
  }];

  public attacks = [{
    name: 'Venoshock',
    cost: [P, C, C],
    damage: 50,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon is Poisoned, this attack does 50 more damage.'
  }];

  public set: string = 'SUM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Toxapex';
  public fullName: string = 'Toxapex SUM';

  public readonly TOXIC_SPIKES_RETREAT_MARKER = 'TOXIC_SPIKES_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Toxic Spikes
    if (effect instanceof RetreatEffect) {
      const retreatingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);

      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      retreatingPlayer.marker.addMarker(this.TOXIC_SPIKES_RETREAT_MARKER, this);
    }

    if (
      effect instanceof MovedToActiveEffect
      && effect.player.marker.hasMarker(this.TOXIC_SPIKES_RETREAT_MARKER, this)
    ) {
      const retreatingPlayer = effect.player;
      retreatingPlayer.marker.removeMarker(this.TOXIC_SPIKES_RETREAT_MARKER, this);

      const abilityOwner = StateUtils.getOpponent(state, retreatingPlayer);
      if (!StateUtils.isPokemonInPlay(abilityOwner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        retreatingPlayer.active,
        [SpecialCondition.POISONED],
      );
    }

    // Venoshock
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.damage += 50;
      }
    }

    return state;
  }
}
