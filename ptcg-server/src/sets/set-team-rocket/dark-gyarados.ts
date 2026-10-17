import { PowerType, State, StoreLike } from '../../game';
import { CardTag, CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonStatsEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import {
  ADD_PARALYZED_TO_PLAYER_ACTIVE,
  AFTER_ATTACK,
  COIN_FLIP_PROMPT,
  IS_POKEBODY_BLOCKED,
} from '../../game/store/prefabs/prefabs';

export class DarkGyarados extends PokemonCard {
  protected _tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Magikarp';
  public cardType: CardType[] = [W];
  public hp: number = 70;
  public weakness = [{ type: G }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Final Beam',
    powerType: PowerType.POKEBODY,
    text: 'When Dark Gyarados is Knocked Out by an attack, flip a coin. If heads, this power does 20 damage for each [W] Energy attached to Dark Gyarados to the Pokémon that Knocked Out Dark Gyarados. Apply Weakness and Resistance. This power doesn\'t work if Dark Gyarados is Asleep, Confused, or Paralyzed.',
  }];

  public attacks = [{
    name: 'Ice Beam',
    cost: [W, W, W],
    damage: 30,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.',
  }];

  public set: string = 'TR';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Gyarados';
  public fullName: string = 'Dark Gyarados TR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Final Beam
    if (effect instanceof KnockOutEffect
      && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const sc = effect.target.specialConditions;
      if (sc.includes(SpecialCondition.ASLEEP)
        || sc.includes(SpecialCondition.CONFUSED)
        || sc.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      const checkEnergy = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkEnergy);
      const waterCount = checkEnergy.energyMap.filter(em =>
        em.provides.includes(CardType.WATER) || em.provides.includes(CardType.ANY)
      ).length;

      if (waterCount === 0) {
        return state;
      }

      const baseDamage = 20 * waterCount;

      COIN_FLIP_PROMPT(store, state, player, flipResult => {
        if (flipResult) {
          const target = opponent.active;
          const checkStats = new CheckPokemonStatsEffect(target);
          store.reduceEffect(state, checkStats);

          let damage = baseDamage;

          for (const w of checkStats.weakness) {
            if (w.type === CardType.WATER) {
              if (w.value === undefined) {
                damage *= 2;
              } else {
                damage += w.value;
              }
            }
          }

          for (const r of checkStats.resistance) {
            if (r.type === CardType.WATER) {
              damage += r.value;
            }
          }

          target.damage += Math.max(0, damage);
        }
      });
    }

    // Ice Beam
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
