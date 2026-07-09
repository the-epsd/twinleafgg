import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import {
  PutDamageEffect, DealDamageEffect, DiscardCardsEffect,
  DiscardCardsFromOpponentsActivePokemonEffect,
  AddMarkerEffect, HealTargetEffect, AddSpecialConditionsEffect,
  RemoveSpecialConditionsEffect, ApplyWeaknessEffect, AfterDamageEffect,
  PutCountersEffect, CardsToHandEffect,
  MoveOpponentEnergyEffect,
  KnockOutOpponentEffect,
  KnockOutPlayerEffect,
  DiscardDefendingPokemonEffect,
  KOEffect,
  LostZoneCardsEffect,
  AfterWeaknessAndResistanceEffect,
  GustOpponentBenchEffect,
  SwitchOutOpponentsActiveEffect,
} from '../effects/attack-effects';
import { HealEffect, KnockOutEffect } from '../effects/game-effects';
import { StateUtils } from '../state-utils';
import { PokemonCard } from '../card/pokemon-card';
import { getCardTarget } from '../../../simple-bot/simple-tactics/simple-tactics';
import {
  EffectOfAttackEffect,
  shouldPreventAttackDamage,
  shouldPreventAttackEffects,
} from '../effects/effect-of-attack-effects';
import { GameStatsTracker } from '../game-stats-tracker';
import { CheckHpEffect } from '../effects/check-effects';
import { MOVE_CARDS, TAKE_X_PRIZES } from '../prefabs/prefabs';
import { GamePhase } from '../state/state';

export function attackReducer(store: StoreLike, state: State, effect: Effect): State {

  if (shouldPreventAttackEffects(state, effect)) {
    return state;
  }

  if (effect instanceof PutDamageEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();

    if (targetCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    if (state.phase === GamePhase.ATTACK && shouldPreventAttackDamage(target, effect.source)) {
      return state;
    }

    const opponent = StateUtils.getOpponent(state, effect.player);

    if (effect.attackEffect && target === opponent.active && !effect.weaknessApplied) {
      // Apply weakness
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);

      effect.damage = applyWeakness.damage;

      const targetOwner = StateUtils.findOwner(state, target);
      targetOwner.marker.addMarkerToState(targetOwner.DAMAGE_DEALT_MARKER);
    }

    // Apply damage reduction for "during opponent's next turn" effects
    if (target.damageReductionNextTurn > 0) {
      effect.damage = Math.max(0, effect.damage - target.damageReductionNextTurn);
    }

    // Apply extra damage for "during your next turn, the Defending Pokemon takes more damage" effects
    if (target.defendingPokemonExtraDamageNextTurn > 0
      && !target.defendingPokemonExtraDamagePending
      && target.defendingPokemonExtraDamageAttackerId === effect.player.id) {
      effect.damage += target.defendingPokemonExtraDamageNextTurn;
    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    if (damage > 0) {
      store.log(state, GameLog.LOG_PLAYER_DEALS_DAMAGE, {
        name: sourceOwner.name,
        damage: damage,
        target: targetCard.name,
        effect: effect.attack.name,
      });

      const targetOwner = StateUtils.findOwner(state, target);
      targetOwner.marker.addMarkerToState(targetOwner.DAMAGE_DEALT_MARKER);

      // Track damage dealt by the attacking Pokemon
      if (effect.attackEffect && effect.source) {
        GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
      }

      if (targetCard.damageTakenLastTurn !== undefined) {
        targetCard.damageTakenLastTurn += damage;
      }

      if (effect.surviveOnTenHPReason !== undefined) {
        const checkHpEffect = new CheckHpEffect(effect.player, target);
        state = store.reduceEffect(state, checkHpEffect);
        if (target.damage > checkHpEffect.hp) {
          store.log(state, GameLog.LOG_SURVIVES_ON_TEN_HP, {
            pokemon: targetCard.name,
            reason: effect.surviveOnTenHPReason,
          });
          target.damage = checkHpEffect.hp - 10;
        }
      }

      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }

    // --- Track damaged targets for animation ---
    if (effect.attackEffect && effect.attackEffect.player && (effect.attackEffect.player.active as any).pendingAttackTargets) {
      try {
        const cardTarget = getCardTarget(effect.attackEffect.player, state, target);
        const pending = (effect.attackEffect.player.active as any).pendingAttackTargets;
        if (Array.isArray(pending) && !pending.some(t => t.player === cardTarget.player && t.slot === cardTarget.slot && t.index === cardTarget.index)) {
          pending.push(cardTarget);
        }
      } catch (e) { /* ignore if cannot resolve target */ }
    }
    // --- End tracking ---
  }

  if (effect instanceof AfterWeaknessAndResistanceEffect) {
    const target = effect.target;
    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    // Track damage dealt by the attacking Pokemon
    if (damage > 0 && effect.attackEffect && effect.source) {
      GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
    }
  }

  if (effect instanceof DealDamageEffect) {
    const base = effect.attackEffect;

    const applyWeakness = new ApplyWeaknessEffect(base, effect.damage);
    applyWeakness.target = effect.target;
    applyWeakness.ignoreWeakness = base.ignoreWeakness;
    applyWeakness.ignoreResistance = base.ignoreResistance;
    state = store.reduceEffect(state, applyWeakness);

    const dealDamage = new PutDamageEffect(base, applyWeakness.damage);
    dealDamage.target = effect.target;
    dealDamage.weaknessApplied = true;
    state = store.reduceEffect(state, dealDamage);

    return state;
  }

  if (effect instanceof KOEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    // Check if the effect is part of an attack and the target is the opponent's active Pokemon
    const opponent = StateUtils.getOpponent(state, effect.player);
    if (effect.attackEffect && target === opponent.active) {
      // Apply weakness
      const applyWeakness = new ApplyWeaknessEffect(effect.attackEffect, effect.damage);
      applyWeakness.target = effect.target;
      applyWeakness.ignoreWeakness = effect.attackEffect.ignoreWeakness;
      applyWeakness.ignoreResistance = effect.attackEffect.ignoreResistance;
      state = store.reduceEffect(state, applyWeakness);

      effect.damage = applyWeakness.damage;

    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    const targetOwner = StateUtils.findOwner(state, target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);

    if (damage > 0) {
      // Track damage dealt by the attacking Pokemon
      if (effect.attackEffect && effect.source) {
        GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
      }

      const afterDamageEffect = new AfterDamageEffect(effect.attackEffect, damage);
      afterDamageEffect.target = effect.target;
      store.reduceEffect(state, afterDamageEffect);
    }
  }

  if (effect instanceof KnockOutOpponentEffect) {
    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const targetOwner = StateUtils.findOwner(state, target);
    const knockOutEffect = new KnockOutEffect(targetOwner, target);
    state = store.reduceEffect(state, knockOutEffect);

    if (!knockOutEffect.preventDefault) {
      effect.knockedOut = true;
      effect.prizeCount = knockOutEffect.prizeCount;
      return TAKE_X_PRIZES(store, state, effect.player, knockOutEffect.prizeCount);
    }

    return state;
  }

  if (effect instanceof KnockOutPlayerEffect) {
    if (effect.preventDefault) {
      return state;
    }

    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const targetOwner = StateUtils.findOwner(state, target);
    const knockOutEffect = new KnockOutEffect(targetOwner, target);
    state = store.reduceEffect(state, knockOutEffect);

    if (!knockOutEffect.preventDefault) {
      effect.knockedOut = true;
      effect.prizeCount = knockOutEffect.prizeCount;
      return TAKE_X_PRIZES(store, state, effect.opponent, knockOutEffect.prizeCount);
    }

    return state;
  }

  if (effect instanceof PutCountersEffect) {
    const target = effect.target;
    const sourceOwner = StateUtils.findOwner(state, effect.source);
    const targetCard = target.getPokemonCard();
    if (targetCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const damage = Math.max(0, effect.damage);
    target.damage += damage;

    if (damage > 0) {
      store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
        name: sourceOwner.name,
        damage: damage,
        target: targetCard.name,
        effect: effect.attack.name,
      });

      // Track damage dealt by the attacking Pokemon
      if (effect.attackEffect && effect.source) {
        GameStatsTracker.trackDamageDealt(effect.player, effect.source, damage);
      }
    }
  }

  if (effect instanceof AfterDamageEffect) {
    const targetOwner = StateUtils.findOwner(state, effect.target);
    targetOwner.marker.addMarkerToState(effect.player.DAMAGE_DEALT_MARKER);
  }

  if (effect instanceof DiscardCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.discard);
    return state;
  }

  if (effect instanceof DiscardCardsFromOpponentsActivePokemonEffect) {
    if (!effect.preventDefault) {
      const target = effect.target;
      const cards = effect.cards;
      const owner = StateUtils.findOwner(state, target);
      return MOVE_CARDS(store, state, target, owner.discard, { cards, sourceEffect: effect });
    }
    return state;
  }

  if (effect instanceof DiscardDefendingPokemonEffect) {
    if (effect.preventDefault) {
      return state;
    }

    const target = effect.target;
    const pokemonCard = target.getPokemonCard();
    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.ILLEGAL_ACTION);
    }

    const owner = StateUtils.findOwner(state, target);
    const pokemons = target.getPokemons();
    const tools = [...target.tools];
    const otherCards = target.cards.filter(card =>
      !pokemons.includes(card as PokemonCard) &&
      !tools.includes(card)
    );

    if (pokemons.length > 0) {
      state = MOVE_CARDS(store, state, target, owner.discard, { cards: pokemons, sourceEffect: effect });
    }
    if (otherCards.length > 0) {
      state = MOVE_CARDS(store, state, target, owner.discard, { cards: otherCards, sourceEffect: effect });
    }
    for (const tool of tools) {
      target.moveCardTo(tool, owner.discard);
    }
    target.clearEffects();
    effect.discarded = true;
    return state;
  }

  if (effect instanceof LostZoneCardsEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.lostzone);
    return state;
  }

  if (effect instanceof CardsToHandEffect) {
    const target = effect.target;
    const cards = effect.cards;
    const owner = StateUtils.findOwner(state, target);
    target.moveCardsTo(cards, owner.hand);
    return state;
  }

  if (effect instanceof MoveOpponentEnergyEffect) {
    if (!effect.preventDefault) {
      effect.target.moveCardTo(effect.card, effect.destination);
    }
    return state;
  }

  if (effect instanceof GustOpponentBenchEffect) {
    if (!effect.preventDefault) {
      effect.opponent.switchPokemon(effect.target, store, state);
    }
    return state;
  }

  if (effect instanceof SwitchOutOpponentsActiveEffect) {
    if (!effect.preventDefault && effect.benchTarget) {
      effect.opponent.switchPokemon(effect.benchTarget, store, state);
    }
    return state;
  }

  if (effect instanceof AddMarkerEffect) {
    const target = effect.target;
    target.marker.addMarker(effect.markerName, effect.markerSource);
    return state;
  }

  if (effect instanceof HealTargetEffect) {
    const target = effect.target;
    const owner = StateUtils.findOwner(state, target);
    const healEffect = new HealEffect(owner, target, effect.damage);
    state = store.reduceEffect(state, healEffect);
    return state;
  }

  if (effect instanceof AddSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.addSpecialCondition(sp);
    });
    if (effect.poisonDamage !== undefined) {
      target.poisonDamage = effect.poisonDamage;
    }
    if (effect.burnDamage !== undefined) {
      target.burnDamage = effect.burnDamage;
    }
    if (effect.confusionDamage !== undefined) {
      target.confusionDamage = effect.confusionDamage;
    }
    return state;
  }

  if (effect instanceof RemoveSpecialConditionsEffect) {
    const target = effect.target;
    effect.specialConditions.forEach(sp => {
      target.removeSpecialCondition(sp);
    });
    return state;
  }

  if (effect instanceof EffectOfAttackEffect) {
    effect.applyEffect();
    return state;
  }

  return state;
}
