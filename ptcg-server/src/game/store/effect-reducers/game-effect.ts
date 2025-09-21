import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { BoardEffect, CardTag, CardType, SpecialCondition, Stage, SuperType } from '../card/card-types';
import { Resistance, Weakness } from '../card/pokemon-types';
import { ApplyWeaknessEffect, DealDamageEffect } from '../effects/attack-effects';
import {
  AddSpecialConditionsPowerEffect,
  CheckAttackCostEffect,
  CheckPokemonStatsEffect,
  CheckPokemonTypeEffect,
  CheckProvidedEnergyEffect
} from '../effects/check-effects';
import { Effect } from '../effects/effect';
import {
  AttackEffect,
  EvolveEffect,
  HealEffect, KnockOutEffect,
  PowerEffect,
  PutDamageCountersEffect,
  TrainerPowerEffect,
  UseAttackEffect,
  UsePowerEffect,
  UseStadiumEffect,
  UseTrainerPowerEffect
} from '../effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../effects/game-phase-effects';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { StateUtils } from '../state-utils';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { MoveCardsEffect } from '../effects/game-effects';
import { GameStatsTracker } from '../game-stats-tracker';
import { PokemonCardList } from '../state/pokemon-card-list';
import { MOVE_CARDS } from '../prefabs/prefabs';
import { CardList } from '../state/card-list';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { checkState } from './check-effect';
import { ChooseAttackPrompt } from '../prompts/choose-attack-prompt';
import { Card } from '../card/card';
import { Attack } from '../card/pokemon-types';
import { WaitPrompt } from '../prompts/wait-prompt';
import { CoinFlipEffect } from '../effects/play-card-effects';


function applyWeaknessAndResistance(
  damage: number,
  cardTypes: CardType[],
  additionalCardTypes: CardType[],
  weakness: Weakness[],
  resistance: Resistance[]
): number {
  let multiply = 1;
  let modifier = 0;

  const allTypes = [...cardTypes, ...additionalCardTypes];

  for (const item of weakness) {
    if (allTypes.includes(item.type)) {
      if (item.value === undefined) {
        multiply *= 2;
      } else {
        modifier += item.value;
      }
    }
  }

  for (const item of resistance) {
    if (allTypes.includes(item.type)) {
      modifier += item.value;
    }
  }

  return (damage * multiply) + modifier;
}

function* useAttack(next: Function, store: StoreLike, state: State, effect: UseAttackEffect | AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  //Skip attack on first turn
  if (state.turn === 1 && effect.attack.canUseOnFirstTurn !== true && state.rules.attackFirstTurn == false) {
    throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
  }

  const sp = player.active.specialConditions;
  if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }

  const attack = effect.attack;
  let attackingPokemon = player.active;

  // Check for attacks that can be used from bench
  player.bench.forEach(benchSlot => {
    const benchPokemon = benchSlot.getPokemonCard();
    if (benchPokemon && benchPokemon.attacks.some(a => a.name === attack.name && a.useOnBench)) {
      attackingPokemon = benchSlot;
    }
  });

  // Get the actual PokemonCard for power checks
  const attackingPokemonCard = attackingPokemon.getPokemonCard();
  // Check for barrage on powers (and not blocked)
  let hasBarragePower = false;
  if (attackingPokemonCard) {
    hasBarragePower = attackingPokemonCard.powers.some(
      power => power.barrage
    );
  }

  const checkAttackCost = new CheckAttackCostEffect(player, attack);
  state = store.reduceEffect(state, checkAttackCost);

  const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, attackingPokemon);
  state = store.reduceEffect(state, checkProvidedEnergy);

  if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost as CardType[]) === false) {
    throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
  }

  if (sp.includes(SpecialCondition.CONFUSED)) {
    let flip = false;

    store.log(state, GameLog.LOG_FLIP_CONFUSION, { name: player.name });
    yield store.prompt(state, new CoinFlipPrompt(
      player.id,
      GameMessage.FLIP_CONFUSION),
      result => {
        flip = result;
        next();
      });

    if (flip === false) {
      store.log(state, GameLog.LOG_HURTS_ITSELF);
      player.active.damage += 30;
      state = store.reduceEffect(state, new EndTurnEffect(player));
      return state;
    }
  }

  store.log(state, GameLog.LOG_PLAYER_USES_ATTACK, { name: player.name, attack: attack.name });
  state.phase = GamePhase.ATTACK;

  // At the start of the attack, initialize pendingAttackTargets
  //  (attackingPokemon as any).pendingAttackTargets = [];

  const attackEffect = (effect instanceof AttackEffect) ? effect : new AttackEffect(player, opponent, attack);
  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  // --- Attack Animation Trigger ---
  // Set triggerAttackAnimation on the attacking Pokemon
  attackingPokemon.triggerAttackAnimation = true;

  // Find slot and index for the attackingPokemon
  let slot: string | undefined = undefined;
  let index: number | undefined = undefined;
  if (player.active === attackingPokemon) {
    slot = 'active';
    index = 0;
  } else {
    slot = 'bench';
    index = player.bench.indexOf(attackingPokemon);
  }
  const card = attackingPokemon.getPokemonCard();
  const cardId = card ? card.id : undefined;

  // Emit attack animation event
  const game = (store as any).handler;
  if (game && game.core && typeof game.core.emit === 'function') {
    game.core.emit((c: any) => {
      if (typeof c.socket !== 'undefined') {
        c.socket.emit(`game[${game.id}]:attack`, {
          playerId: player.id,
          cardId,
          slot,
          index
        });
      }
    });
  }

  // Yield a wait prompt for the animation (1 second)
  yield store.prompt(state, new WaitPrompt(player.id, 1000, 'Attack animation'), () => {
    // After wait, clear the animation flag
    attackingPokemon.triggerAttackAnimation = false;
    next();
  });
  // --- End Attack Animation Trigger ---

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  const afterAttackEffect = new AfterAttackEffect(effect.player, opponent, attack);
  state = store.reduceEffect(state, afterAttackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if ((attack.barrage || hasBarragePower) && !(effect as any)._barrageUsed) {
    state = checkState(store, state);
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
    state = checkState(store, state);
    if (store.hasPrompts()) {
      yield store.waitPrompt(state, () => next());
    }
    let wantToUse: boolean | undefined = undefined;
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_USE_ABILITY
    ), result => {
      wantToUse = result;
      next();
    });

    if (wantToUse) {
      // If barrage is from a power, prompt for attack choice
      if (!attack.barrage && hasBarragePower) {
        // Gather all attackable cards: the actual Pokemon and any attached tool with attacks
        const attackableCards: Card[] = [];
        const mainPokemon = attackingPokemon.getPokemonCard();
        if (mainPokemon) {
          attackableCards.push(mainPokemon);
        }
        if (attackingPokemon.tools.length > 0) {
          attackableCards.push(attackingPokemon.tools[0]);
        }
        yield store.prompt(state, new ChooseAttackPrompt(
          player.id,
          GameMessage.CHOOSE_ATTACK_TO_COPY,
          attackableCards,
          { allowCancel: false }
        ), (selectedAttack: Attack | null) => {
          if (selectedAttack) {
            const newEffect = new AttackEffect(player, opponent, selectedAttack);
            (newEffect as any)._barrageUsed = true;
            const generator = useAttack(() => generator.next(), store, state, newEffect);
            state = generator.next().value;
          } else {
            state = store.reduceEffect(state, new EndTurnEffect(player));
          }
          next();
        });
        return state;
      } else {
        // Default: use the same attack again
        const newEffect = new UseAttackEffect(player, attack);
        (newEffect as any)._barrageUsed = true;
        const generator = useAttack(() => generator.next(), store, state, newEffect);
        return generator.next().value;
      }
    }
    return store.reduceEffect(state, new EndTurnEffect(player));
  }

  return store.reduceEffect(state, new EndTurnEffect(player));
}

export function gameReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof KnockOutEffect) {
    const card = effect.target.getPokemonCard();
    if (card !== undefined) {

      // Pokemon ex rule
      if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.POKEMON_GX)) {
        effect.prizeCount += 1;
      }
      if (card.tags.includes(CardTag.POKEMON_SV_MEGA) || card.tags.includes(CardTag.TAG_TEAM) || card.tags.includes(CardTag.DUAL_LEGEND)) {
        effect.prizeCount += 1;
      }

      if (card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_VUNION)) {
        effect.prizeCount += 2;
      }

      store.log(state, GameLog.LOG_POKEMON_KO, { name: card.name });

      // Handle Lost City marker or PRISM_STAR cards
      if (effect.target.marker.hasMarker('LOST_CITY_MARKER') || card.tags.includes(CardTag.PRISM_STAR)) {
        const lostZoned = new CardList();
        const attachedCards = new CardList();
        const tools = [...effect.target.tools];
        const pokemonIndices = effect.target.cards.map((card, index) => index);

        // Move tools to discard BEFORE clearing effects (directly)
        for (const tool of tools) {
          effect.target.moveCardTo(tool, effect.player.discard);
        }

        // Clear damage and effects
        effect.target.damage = 0;
        effect.target.clearEffects();

        for (let i = pokemonIndices.length - 1; i >= 0; i--) {
          const removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];

          // Handle cardlist cards (energy, tools, etc.)
          if (removedCard.cards) {
            const cards = removedCard.cards;
            while (cards.cards.length > 0) {
              const card = cards.cards[0];
              attachedCards.cards.push(card);
              cards.cards.splice(0, 1);
            }
          }

          // Handle the main card
          if (removedCard.superType === SuperType.POKEMON || (<any>removedCard).stage === Stage.BASIC || removedCard.tags.includes(CardTag.PRISM_STAR)) {
            lostZoned.cards.push(removedCard);
          } else {
            attachedCards.cards.push(removedCard);
          }
        }

        // Move attached cards to discard
        if (attachedCards.cards.length > 0) {
          state = MOVE_CARDS(store, state, attachedCards, effect.player.discard);
        }

        // Move Pokémon to lost zone
        if (lostZoned.cards.length > 0) {
          state = MOVE_CARDS(store, state, lostZoned, effect.player.lostzone);
        }
      } else {
        // Default behavior - move to discard
        const tools = [...effect.target.tools];
        // Move tools to discard BEFORE clearing effects (directly)
        for (const tool of tools) {
          effect.target.moveCardTo(tool, effect.player.discard);
        }
        effect.target.clearEffects();
        state = MOVE_CARDS(store, state, effect.target, effect.player.discard);
      }
    }
  }

  if (effect instanceof ApplyWeaknessEffect) {
    const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
    state = store.reduceEffect(state, checkPokemonType);
    const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
    state = store.reduceEffect(state, checkPokemonStats);

    const cardType = checkPokemonType.cardTypes;
    const additionalCardTypes = checkPokemonType.cardTypes;
    const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
    const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
    effect.damage = applyWeaknessAndResistance(effect.damage, cardType, additionalCardTypes, weakness, resistance);
    return state;
  }

  if (effect instanceof UseAttackEffect) {
    const generator = useAttack(() => generator.next(), store, state, effect);
    return generator.next().value;
  }

  if (effect instanceof UsePowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;

    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new PowerEffect(player, power, card));
    return state;
  }

  if (effect instanceof UseTrainerPowerEffect) {
    const player = effect.player;
    const power = effect.power;
    const card = effect.card;

    store.log(state, GameLog.LOG_PLAYER_USES_ABILITY, { name: player.name, ability: power.name });
    state = store.reduceEffect(state, new TrainerPowerEffect(player, power, card));
    return state;
  }

  if (effect instanceof AddSpecialConditionsPowerEffect) {
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
    if (effect.sleepFlips !== undefined) {
      target.sleepFlips = effect.sleepFlips;
    }
    return state;
  }

  if (effect instanceof UseStadiumEffect) {
    const player = effect.player;
    store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
    player.stadiumUsedTurn = state.turn;
  }

  // if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
  //   const player = effect.player;
  //   store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
  // }

  if (effect instanceof HealEffect) {
    effect.target.damage = Math.max(0, effect.target.damage - effect.damage);
    return state;
  }

  if (effect instanceof PutDamageCountersEffect) {
    // First process the EffectOfAbilityEffect
    state = store.reduceEffect(state, effect.effectOfAbility);

    // Then apply the damage if the effect wasn't prevented
    if (effect.effectOfAbility.target) {
      const damage = Math.max(0, effect.damage);
      effect.effectOfAbility.target.damage += damage;

      if (damage > 0) {
        const targetCard = effect.effectOfAbility.target.getPokemonCard();
        if (targetCard) {
          store.log(state, GameLog.LOG_PLAYER_PLACES_DAMAGE_COUNTERS, {
            name: effect.player.name,
            damage: damage,
            target: targetCard.name,
            effect: effect.power.name,
          });
        }
      }
    }
    return state;
  }

  if (effect instanceof EvolveEffect) {
    const pokemonCard = effect.target.getPokemonCard();

    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }

    // Track Pokemon evolution for damage continuity
    GameStatsTracker.handlePokemonEvolution(
      effect.player,
      effect.target,
      pokemonCard,
      effect.pokemonCard
    );

    store.log(state, GameLog.LOG_PLAYER_EVOLVES_POKEMON, {
      name: effect.player.name,
      pokemon: pokemonCard.name,
      card: effect.pokemonCard.name
    });
    effect.player.hand.moveCardTo(effect.pokemonCard, effect.target);
    effect.target.pokemonPlayedTurn = state.turn;
    // effect.target.clearEffects();
    // Apply the removePokemonEffects method from the Player class
    // effect.player.removePokemonEffects(effect.target);
    effect.target.specialConditions = [];
    effect.target.marker.markers = [];
  }

  if (effect instanceof MoveCardsEffect) {
    const source = effect.source;
    const destination = effect.destination;

    // If source is a PokemonCardList, always clean up when moving cards
    if (source instanceof PokemonCardList) {
      source.clearEffects();
      source.damage = 0;
      source.specialConditions = [];
      source.marker.markers = [];
      source.tools = [];
      source.removeBoardEffect(BoardEffect.ABILITY_USED);
    }

    // Helper to get owner of a CardList
    const getOwner = (cardList: CardList) => {
      try {
        return StateUtils.findOwner(state, cardList);
      } catch {
        return undefined;
      }
    };

    // Helper to check if a CardList is a player's discard
    const isDiscardPile = (cardList: CardList) => {
      const owner = getOwner(cardList);
      return owner && owner.discard === cardList;
    };

    // Move logic for Prism Star cards
    const moveWithPrismStarCheck = (cardsToMove: any[], src: CardList, dest: CardList) => {
      if (isDiscardPile(dest)) {
        const owner = getOwner(dest);
        const toLostZone = cardsToMove.filter(card => card.tags && card.tags.includes(CardTag.PRISM_STAR));
        const toDiscard = cardsToMove.filter(card => !(card.tags && card.tags.includes(CardTag.PRISM_STAR)));
        if (toLostZone.length > 0 && owner) {
          src.moveCardsTo(toLostZone, owner.lostzone);
        }
        if (toDiscard.length > 0) {
          src.moveCardsTo(toDiscard, dest);
        }
      } else {
        src.moveCardsTo(cardsToMove, dest);
      }
    };

    // If specific cards are specified
    if (effect.cards) {
      moveWithPrismStarCheck(effect.cards, source, destination);
      if (effect.toBottom) {
        destination.cards = [...destination.cards.slice(effect.cards.length), ...effect.cards];
      } else if (effect.toTop) {
        destination.cards = [...effect.cards, ...destination.cards];
      }
    }
    // If count is specified
    else if (effect.count !== undefined) {
      const cards = source.cards.slice(0, effect.count);
      moveWithPrismStarCheck(cards, source, destination);
      if (effect.toBottom) {
        destination.cards = [...destination.cards.slice(cards.length), ...cards];
      } else if (effect.toTop) {
        destination.cards = [...cards, ...destination.cards];
      }
    }
    // Move all cards
    else {
      // For move all, check for Prism Star cards
      if (isDiscardPile(destination)) {
        const owner = getOwner(destination);
        const toLostZone = source.cards.filter(card => card.tags && card.tags.includes(CardTag.PRISM_STAR));
        const toDiscard = source.cards.filter(card => !(card.tags && card.tags.includes(CardTag.PRISM_STAR)));
        if (toLostZone.length > 0 && owner) {
          source.moveCardsTo(toLostZone, owner.lostzone);
        }
        if (toDiscard.length > 0) {
          source.moveCardsTo(toDiscard, destination);
        }
      } else {
        if (effect.toTop) {
          source.moveToTopOfDestination(destination);
        } else {
          source.moveTo(destination);
        }
      }
    }

    // If source is a PokemonCardList and we moved all cards, discard remaining attached cards
    if (source instanceof PokemonCardList && source.getPokemons().length === 0) {
      const player = StateUtils.findOwner(state, source);
      source.moveTo(player.discard);
    }

    return state;
  }

  if (effect instanceof CoinFlipEffect) {
    // Simulate coin flip and store result
    const result = Math.random() < 0.5;
    (effect as CoinFlipEffect).result = result;

    // Log the coin flip result
    const gameMessage = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
    store.log(state, gameMessage, { name: (effect as CoinFlipEffect).player.name });

    // Call callback if provided
    if ((effect as CoinFlipEffect).callback) {
      (effect as CoinFlipEffect).callback!(result);
    }

    return state;
  }

  return state;
}

