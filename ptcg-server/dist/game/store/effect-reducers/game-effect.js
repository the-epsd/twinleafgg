import { GameError } from '../../game-error';
import { GameMessage, GameLog } from '../../game-message';
import { EndTurnEffect } from '../effects/game-phase-effects';
import { GamePhase } from '../state/state';
import { StateUtils } from '../state-utils';
import { CheckPokemonTypeEffect, CheckPokemonStatsEffect, CheckProvidedEnergyEffect, CheckAttackCostEffect } from '../effects/check-effects';
import { SpecialCondition, CardTag, TrainerType, Format } from '../card/card-types';
import { AttackEffect, UseAttackEffect, HealEffect, KnockOutEffect, UsePowerEffect, PowerEffect, UseStadiumEffect, EvolveEffect } from '../effects/game-effects';
import { CoinFlipPrompt } from '../prompts/coin-flip-prompt';
import { DealDamageEffect, ApplyWeaknessEffect } from '../effects/attack-effects';
import { TrainerEffect } from '../effects/play-card-effects';
function applyWeaknessAndResistance(damage, cardTypes, weakness, resistance) {
    let multiply = 1;
    let modifier = 0;
    for (const item of weakness) {
        if (cardTypes.includes(item.type)) {
            if (item.value === undefined) {
                multiply *= 2;
            }
            else {
                modifier += item.value;
            }
        }
    }
    for (const item of resistance) {
        if (cardTypes.includes(item.type)) {
            modifier += item.value;
        }
    }
    return (damage * multiply) + modifier;
}
function* useAttack(next, store, state, effect) {
    const player = effect.player;
    const opponent = StateUtils.getOpponent(state, player);
    if (Format.STANDARD) {
        //Skip attack on first turn
        if (state.turn === 1 && player.canAttackFirstTurn !== true) {
            throw new GameError(GameMessage.CANNOT_ATTACK_ON_FIRST_TURN);
        }
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
    const checkAttackCost = new CheckAttackCostEffect(player, attack);
    state = store.reduceEffect(state, checkAttackCost);
    const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
    state = store.reduceEffect(state, checkProvidedEnergy);
    if (StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, checkAttackCost.cost) === false) {
        throw new GameError(GameMessage.NOT_ENOUGH_ENERGY);
    }
    if (sp.includes(SpecialCondition.CONFUSED)) {
        let flip = false;
        store.log(state, GameLog.LOG_FLIP_CONFUSION, { name: player.name });
        yield store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.FLIP_CONFUSION), result => {
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
    return store.reduceEffect(state, new EndTurnEffect(player));
}
export function gameReducer(store, state, effect) {
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
            effect.target.moveTo(effect.player.discard);
            effect.target.clearEffects();
        }
    }
    if (effect instanceof ApplyWeaknessEffect) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        state = store.reduceEffect(state, checkPokemonType);
        const checkPokemonStats = new CheckPokemonStatsEffect(effect.target);
        state = store.reduceEffect(state, checkPokemonStats);
        const cardType = checkPokemonType.cardTypes;
        const weakness = effect.ignoreWeakness ? [] : checkPokemonStats.weakness;
        const resistance = effect.ignoreResistance ? [] : checkPokemonStats.resistance;
        effect.damage = applyWeaknessAndResistance(effect.damage, cardType, weakness, resistance);
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
    if (effect instanceof UseStadiumEffect) {
        const player = effect.player;
        store.log(state, GameLog.LOG_PLAYER_USES_STADIUM, { name: player.name, stadium: effect.stadium.name });
        player.stadiumUsedTurn = state.turn;
    }
    if (effect instanceof TrainerEffect && effect.trainerCard.trainerType === TrainerType.SUPPORTER) {
        const player = effect.player;
        store.log(state, GameLog.LOG_PLAYER_PLAYS_SUPPORTER, { name: player.name, stadium: effect.trainerCard.name });
    }
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
        effect.target.clearEffects();
        // Apply the removePokemonEffects method from the Player class
        effect.player.removePokemonEffects(effect.target);
    }
    return state;
}
