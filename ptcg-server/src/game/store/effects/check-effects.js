"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.CheckPrizesDestinationEffect = exports.AddSpecialConditionsPowerEffect = exports.CheckTableStateEffect = exports.CheckProvidedEnergyEffect = exports.CheckAttackCostEffect = exports.CheckRetreatCostEffect = exports.CheckPokemonTypeEffect = exports.CheckPokemonStatsEffect = exports.CheckPokemonPlayedTurnEffect = exports.CheckHpEffect = exports.CheckPokemonAttacksEffect = exports.CheckPokemonPowersEffect = exports.CheckEffects = void 0;
var CheckEffects;
(function (CheckEffects) {
    CheckEffects["CHECK_HP_EFFECT"] = "CHECK_HP_EFFECT";
    CheckEffects["CHECK_PRIZES_COUNT_EFFECT"] = "CHECK_PRIZE_COUNT_EFFECT";
    CheckEffects["CHECK_POKEMON_STATS_EFFECT"] = "CHECK_POKEMON_STATS_EFFECT";
    CheckEffects["CHECK_POKEMON_POWERS_EFFECT"] = "CHECK_POKEMON_POWERS_EFFECT";
    CheckEffects["CHECK_POKEMON_ATTACKS_EFFECT"] = "CHECK_POKEMON_ATTACKS_EFFECT";
    CheckEffects["CHECK_POKEMON_TYPE_EFFECT"] = "CHECK_POKEMON_TYPE_EFFECT";
    CheckEffects["CHECK_RETREAT_COST_EFFECT"] = "CHECK_RETREAT_COST_EFFECT";
    CheckEffects["CHECK_ATTACK_COST_EFFECT"] = "CHECK_ATTACK_COST_EFFECT";
    CheckEffects["CHECK_ENOUGH_ENERGY_EFFECT"] = "CHECK_ENOUGH_ENERGY_EFFECT";
    CheckEffects["CHECK_POKEMON_PLAYED_TURN_EFFECT"] = "CHECK_POKEMON_PLAYED_TURN_EFFECT";
    CheckEffects["CHECK_TABLE_STATE_EFFECT"] = "CHECK_TABLE_STATE_EFFECT";
    CheckEffects["ADD_SPECIAL_CONDITIONS_EFFECT"] = "ADD_SPECIAL_CONDITIONS_EFFECT";
    CheckEffects["CHECK_PRIZES_DESTINATION_EFFECT"] = "CHECK_PRIZES_DESTINATION_EFFECT";
})(CheckEffects = exports.CheckEffects || (exports.CheckEffects = {}));
var CheckPokemonPowersEffect = /** @class */ (function () {
    function CheckPokemonPowersEffect(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_POWERS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        var pokemonCard = target.getPokemonCard();
        this.powers = pokemonCard ? pokemonCard.powers : [];
    }
    return CheckPokemonPowersEffect;
}());
exports.CheckPokemonPowersEffect = CheckPokemonPowersEffect;
var CheckPokemonAttacksEffect = /** @class */ (function () {
    function CheckPokemonAttacksEffect(player) {
        this.type = CheckEffects.CHECK_POKEMON_ATTACKS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        var tool = player.active.tool;
        if (!!tool && tool.attacks.length > 0) {
            this.attacks = __spreadArray([], tool.attacks);
        }
        else {
            this.attacks = [];
        }
    }
    return CheckPokemonAttacksEffect;
}());
exports.CheckPokemonAttacksEffect = CheckPokemonAttacksEffect;
var CheckHpEffect = /** @class */ (function () {
    function CheckHpEffect(player, target) {
        this.type = CheckEffects.CHECK_HP_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        var pokemonCard = target.getPokemonCard();
        this.hp = pokemonCard ? pokemonCard.hp : 0;
    }
    return CheckHpEffect;
}());
exports.CheckHpEffect = CheckHpEffect;
var CheckPokemonPlayedTurnEffect = /** @class */ (function () {
    function CheckPokemonPlayedTurnEffect(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonPlayedTurn = target.pokemonPlayedTurn;
    }
    return CheckPokemonPlayedTurnEffect;
}());
exports.CheckPokemonPlayedTurnEffect = CheckPokemonPlayedTurnEffect;
var CheckPokemonStatsEffect = /** @class */ (function () {
    function CheckPokemonStatsEffect(target) {
        this.type = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
        this.preventDefault = false;
        this.target = target;
        var pokemonCard = target.getPokemonCard();
        this.weakness = pokemonCard ? __spreadArray([], pokemonCard.weakness) : [];
        this.resistance = pokemonCard ? __spreadArray([], pokemonCard.resistance) : [];
    }
    return CheckPokemonStatsEffect;
}());
exports.CheckPokemonStatsEffect = CheckPokemonStatsEffect;
var CheckPokemonTypeEffect = /** @class */ (function () {
    function CheckPokemonTypeEffect(target) {
        this.type = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
        this.preventDefault = false;
        this.target = target;
        var pokemonCard = target.getPokemonCard();
        this.cardTypes = pokemonCard ? [pokemonCard.cardType] : [];
        if (pokemonCard && pokemonCard.additionalCardTypes) {
            this.cardTypes = __spreadArray(__spreadArray([], this.cardTypes), pokemonCard.additionalCardTypes);
        }
    }
    return CheckPokemonTypeEffect;
}());
exports.CheckPokemonTypeEffect = CheckPokemonTypeEffect;
var CheckRetreatCostEffect = /** @class */ (function () {
    function CheckRetreatCostEffect(player) {
        this.type = CheckEffects.CHECK_RETREAT_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        var pokemonCard = player.active.getPokemonCard();
        this.cost = pokemonCard !== undefined ? __spreadArray([], pokemonCard.retreat) : [];
    }
    return CheckRetreatCostEffect;
}());
exports.CheckRetreatCostEffect = CheckRetreatCostEffect;
var CheckAttackCostEffect = /** @class */ (function () {
    function CheckAttackCostEffect(player, attack) {
        this.type = CheckEffects.CHECK_ATTACK_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
        this.cost = __spreadArray([], attack.cost);
    }
    return CheckAttackCostEffect;
}());
exports.CheckAttackCostEffect = CheckAttackCostEffect;
var CheckProvidedEnergyEffect = /** @class */ (function () {
    function CheckProvidedEnergyEffect(player, source) {
        this.type = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
        this.preventDefault = false;
        this.energyMap = [];
        this.totalProvidedTypes = [];
        this.player = player;
        this.source = source === undefined ? player.active : source;
    }
    return CheckProvidedEnergyEffect;
}());
exports.CheckProvidedEnergyEffect = CheckProvidedEnergyEffect;
var CheckTableStateEffect = /** @class */ (function () {
    function CheckTableStateEffect(benchSizes) {
        this.type = CheckEffects.CHECK_TABLE_STATE_EFFECT;
        this.preventDefault = false;
        this.benchSizes = benchSizes;
    }
    return CheckTableStateEffect;
}());
exports.CheckTableStateEffect = CheckTableStateEffect;
var AddSpecialConditionsPowerEffect = /** @class */ (function () {
    function AddSpecialConditionsPowerEffect(player, source, target, specialConditions, poisonDamage, burnDamage, sleepFlips) {
        if (poisonDamage === void 0) { poisonDamage = 10; }
        if (burnDamage === void 0) { burnDamage = 20; }
        if (sleepFlips === void 0) { sleepFlips = 1; }
        this.type = CheckEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.source = source;
        this.target = target;
        this.specialConditions = specialConditions;
        this.poisonDamage = poisonDamage;
        this.burnDamage = burnDamage;
        this.sleepFlips = sleepFlips;
    }
    return AddSpecialConditionsPowerEffect;
}());
exports.AddSpecialConditionsPowerEffect = AddSpecialConditionsPowerEffect;
var CheckPrizesDestinationEffect = /** @class */ (function () {
    function CheckPrizesDestinationEffect(player, destination) {
        this.type = CheckEffects.CHECK_PRIZES_DESTINATION_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.destination = destination;
    }
    return CheckPrizesDestinationEffect;
}());
exports.CheckPrizesDestinationEffect = CheckPrizesDestinationEffect;
