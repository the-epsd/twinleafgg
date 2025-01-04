import { GameError } from '../../game-error';
import { GameLog, GameMessage } from '../../game-message';
import { CardTag, CardType, SpecialCondition, Stage, SuperType } from '../card/card-types';
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
  TrainerPowerEffect,
  UseAttackEffect,
  UsePowerEffect,
  UseStadiumEffect,
  UseTrainerPowerEffect
} from '../effects/game-effects';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { ChooseAttackPrompt } from '../prompts/choose-attack-prompt';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { ConfirmPrompt } from '../prompts/confirm-prompt';
import { StateUtils } from '../state-utils';
import { CardList } from '../state/card-list';
import { GamePhase, State } from '../state/state';
import { StoreLike } from '../store-like';
import { checkState } from './check-effect';

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


function* useAttack(next: Function, store: StoreLike, state: State, effect: UseAttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);


  //Skip attack on first turn
  if (state.turn === 1 && player.canAttackFirstTurn !== true && state.rules.attackFirstTurn == false) {
    throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
  }

  const sp = player.active.specialConditions;
  if (sp.includes(SpecialCondition.PARALYZED) || sp.includes(SpecialCondition.ASLEEP)) {
    throw new GameError(GameMessage.BLOCKED_BY_SPECIAL_CONDITION);
  }

  // if (player.alteredCreationDamage == true) {
  //   player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
  //     if (effect instanceof DealDamageEffect && effect.source === cardList) {
  //       effect.damage += 20;
  //     }
  //   });
  // }

  const attack = effect.attack;
  let attackingPokemon = player.active;

  // If this is Alakazam ex's attack from the bench, use that instead
  player.bench.forEach(benchSlot => {
    const benchPokemon = benchSlot.getPokemonCard();
    if (benchPokemon && benchPokemon.name === 'Alakazam ex' && benchPokemon.attacks.some(a => a.name === attack.name)) {
      attackingPokemon = benchSlot;
    }
  });

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
  const attackEffect = new AttackEffect(player, opponent, attack);
  state = store.reduceEffect(state, attackEffect);

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  if (attackEffect.damage > 0) {
    const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
    state = store.reduceEffect(state, dealDamage);
  }

  if (store.hasPrompts()) {
    yield store.waitPrompt(state, () => next());
  }

  // Check for knockouts and process them
  state = checkState(store, state);

  // Check if the opponent's active Pokémon is knocked out
  if (opponent.active.cards.length === 0) {
    // Wait for the opponent to select a new active Pokémon
    yield store.waitPrompt(state, () => next());
  }

  const attackThisTurn = player.active.attacksThisTurn;
  const playerActive = player.active.getPokemonCard();

  // Now, we can check if the Pokémon can attack again
  const canAttackAgain = playerActive && playerActive.canAttackTwice && attackThisTurn && attackThisTurn < 2;
  const hasBarrageAbility = player.active.getPokemonCard()?.powers.some(power => power.barrage === true);

  if (canAttackAgain || hasBarrageAbility) {
    // Prompt the player if they want to attack again
    yield store.prompt(state, new ConfirmPrompt(
      player.id,
      GameMessage.WANT_TO_ATTACK_AGAIN
    ), wantToAttackAgain => {
      if (wantToAttackAgain) {
        if (hasBarrageAbility) {
          // Use ChooseAttackPrompt for Barrage ability
          store.prompt(state, new ChooseAttackPrompt(
            player.id,
            GameMessage.CHOOSE_ATTACK_TO_COPY,
            [player.active.cards[0]],
            { allowCancel: false }
          ), selectedAttack => {
            if (selectedAttack) {
              const secondAttackEffect = new AttackEffect(player, opponent, selectedAttack);
              state = useAttack(() => next(), store, state, secondAttackEffect).next().value;

              if (store.hasPrompts()) {
                state = store.waitPrompt(state, () => next());
              }

              if (secondAttackEffect.damage > 0) {
                const dealDamage = new DealDamageEffect(secondAttackEffect, secondAttackEffect.damage);
                state = store.reduceEffect(state, dealDamage);
              }

              return state; // Successfully executed attack, exit the function
            }
            next();
          });
        } else {
          // Recursively call useAttack for the second attack (for non-Barrage abilities)
          const dealDamage = new DealDamageEffect(attackEffect, attackEffect.damage);
          state = store.reduceEffect(state, dealDamage);
        }
      }
      next();
    });
  }
  return store.reduceEffect(state, new EndTurnEffect(player));
}

export function gameReducer(store: StoreLike, state: State, effect: Effect): State {

  if (effect instanceof KnockOutEffect) {
    // const player = effect.player;
    const card = effect.target.getPokemonCard();
    if (card !== undefined) {

      //Altered Creation GX
      // if (player.usedAlteredCreation == true) {
      //   effect.prizeCount += 1;
      // }

      // Pokemon ex rule
      if (card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex) || card.tags.includes(CardTag.POKEMON_GX)) {
        effect.prizeCount += 1;
      }
      if (card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.TAG_TEAM)) {
        effect.prizeCount += 2;
      }

      store.log(state, GameLog.LOG_POKEMON_KO, { name: card.name });

      const stadiumCard = StateUtils.getStadiumCard(state);

      if (card.tags.includes(CardTag.PRISM_STAR) || stadiumCard && stadiumCard.name === 'Lost City') {
        const lostZoned = new CardList();
        const pokemonIndices = effect.target.cards.map((card, index) => index);

        for (let i = pokemonIndices.length - 1; i >= 0; i--) {
          const removedCard = effect.target.cards.splice(pokemonIndices[i], 1)[0];

          // the basic check handles lillie's poke doll and the like
          if (removedCard.superType === SuperType.POKEMON || (<any>removedCard).stage === Stage.BASIC) {
            lostZoned.cards.push(removedCard);
          }
        }

        lostZoned.moveTo(effect.player.lostzone);
        effect.target.clearEffects();
      } else {
        effect.target.moveTo(effect.player.discard);
        effect.target.clearEffects();
      }

      // const stadiumCard = StateUtils.getStadiumCard(state);

      // if (card.tags.includes(CardTag.PRISM_STAR) || stadiumCard && stadiumCard.name === 'Lost City') {
      //   effect.target.moveTo(effect.player.lostzone);
      //   effect.target.clearEffects();
      // } else {
      //   effect.target.moveTo(effect.player.discard);
      //   effect.target.clearEffects();
      // }
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

  if (effect instanceof EvolveEffect) {
    const pokemonCard = effect.target.getPokemonCard();

    if (pokemonCard === undefined) {
      throw new GameError(GameMessage.INVALID_TARGET);
    }
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
    effect.target.attackMarker.markers = [];
    effect.target.abilityMarker.markers = [];
  }

  return state;
}
