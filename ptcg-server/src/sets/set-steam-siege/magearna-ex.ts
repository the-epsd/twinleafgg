import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, NEXT_TURN_ATTACK_BASE_DAMAGE } from '../../game/store/prefabs/prefabs';
import { AbstractAttackEffect, ApplyWeaknessEffect, DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class MagearnaEX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_EX];
  public cardType: CardType = M;
  public hp: number = 160;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Mystic Heart',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of your opponent\'s attacks, except damage, done to each of your Pokémon that has any [M] Energy attached to it. (Existing effects are not removed.)'
  }];

  public attacks = [{
    name: 'Soul Blaster',
    cost: [M, C, C],
    damage: 120,
    text: 'During your next turn, this Pokémon\'s Soul Blaster attack\'s base damage is 60.'
  }];

  public set: string = 'STS';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Magearna-EX';
  public fullName: string = 'Magearna-EX STS';

  public readonly SOUL_BLASER_MARKER = 'SOUL_BLASER_MARKER';
  public readonly SOUL_BLASER_CLEAR_MARKER = 'SOUL_BLASER_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AbstractAttackEffect) {
      const player = StateUtils.findOwner(state, effect.target);

      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      let hasMagearnaInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasMagearnaInPlay = true;
        }
      });

      if (!hasMagearnaInPlay) {
        return state;
      }

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      const energyMap = checkProvidedEnergyEffect.energyMap;
      const hasMetalEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.METAL]);

      if (hasMetalEnergy) {
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

    // Refs: set-jungle/scyther.ts (Swords Dance), prefabs/prefabs.ts (NEXT_TURN_ATTACK_BASE_DAMAGE)
    NEXT_TURN_ATTACK_BASE_DAMAGE(effect, {
      setupAttack: this.attacks[0],
      boostedAttack: this.attacks[0],
      source: this,
      baseDamage: 60,
      bonusMarker: this.SOUL_BLASER_MARKER,
      clearMarker: this.SOUL_BLASER_CLEAR_MARKER
    });

    return state;
  }

}
