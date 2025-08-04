import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_MARKER, HAS_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
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

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.SOUL_BLASER_MARKER, this, this);
      ADD_MARKER(this.SOUL_BLASER_MARKER, effect.player, this);

      if (HAS_MARKER(this.SOUL_BLASER_MARKER, this, this)) {
        effect.damage = 60;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.SOUL_BLASER_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.SOUL_BLASER_MARKER, effect.player, this);
    }

    if (effect instanceof EndTurnEffect && !HAS_MARKER(this.SOUL_BLASER_MARKER, effect.player, this)) {
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        REMOVE_MARKER(this.SOUL_BLASER_MARKER, effect.player, card);
      });
    }

    return state;
  }

}
