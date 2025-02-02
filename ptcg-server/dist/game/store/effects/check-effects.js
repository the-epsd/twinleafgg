export var CheckEffects;
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
})(CheckEffects || (CheckEffects = {}));
export class CheckPokemonPowersEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_POWERS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.powers = pokemonCard ? pokemonCard.powers : [];
    }
}
export class CheckPokemonAttacksEffect {
    constructor(player) {
        this.type = CheckEffects.CHECK_POKEMON_ATTACKS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        const tool = player.active.tool;
        if (!!tool && tool.attacks.length > 0) {
            this.attacks = [...tool.attacks];
        }
        else {
            this.attacks = [];
        }
    }
}
export class CheckHpEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_HP_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.hp = pokemonCard ? pokemonCard.hp : 0;
    }
}
export class CheckPokemonPlayedTurnEffect {
    constructor(player, target) {
        this.type = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonPlayedTurn = target.pokemonPlayedTurn;
    }
}
export class CheckPokemonStatsEffect {
    constructor(target) {
        this.type = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
        this.preventDefault = false;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.weakness = pokemonCard ? [...pokemonCard.weakness] : [];
        this.resistance = pokemonCard ? [...pokemonCard.resistance] : [];
    }
}
export class CheckPokemonTypeEffect {
    constructor(target) {
        this.type = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
        this.preventDefault = false;
        this.target = target;
        const pokemonCard = target.getPokemonCard();
        this.cardTypes = pokemonCard ? [pokemonCard.cardType] : [];
        if (pokemonCard && pokemonCard.additionalCardTypes) {
            this.cardTypes = [...this.cardTypes, ...pokemonCard.additionalCardTypes];
        }
    }
}
export class CheckRetreatCostEffect {
    constructor(player) {
        this.type = CheckEffects.CHECK_RETREAT_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        const pokemonCard = player.active.getPokemonCard();
        this.cost = pokemonCard !== undefined ? [...pokemonCard.retreat] : [];
    }
}
export class CheckAttackCostEffect {
    constructor(player, attack) {
        this.type = CheckEffects.CHECK_ATTACK_COST_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
        this.cost = [...attack.cost];
    }
}
export class CheckProvidedEnergyEffect {
    constructor(player, source) {
        this.type = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
        this.preventDefault = false;
        this.energyMap = [];
        this.totalProvidedTypes = [];
        this.player = player;
        this.source = source === undefined ? player.active : source;
    }
}
export class CheckTableStateEffect {
    constructor(benchSizes) {
        this.type = CheckEffects.CHECK_TABLE_STATE_EFFECT;
        this.preventDefault = false;
        this.benchSizes = benchSizes;
    }
}
export class AddSpecialConditionsPowerEffect {
    constructor(player, power, card, target, specialConditions) {
        this.type = CheckEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
        this.specialConditions = specialConditions;
    }
}
