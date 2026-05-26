export var GameEffects;
(function (GameEffects) {
    GameEffects["RETREAT_EFFECT"] = "RETREAT_EFFECT";
    GameEffects["RETREAT_START_EFFECT"] = "RETREAT_START_EFFECT";
    GameEffects["USE_ATTACK_EFFECT"] = "USE_ATTACK_EFFECT";
    GameEffects["USE_STADIUM_EFFECT"] = "USE_STADIUM_EFFECT";
    GameEffects["USE_POWER_EFFECT"] = "USE_POWER_EFFECT";
    GameEffects["POWER_EFFECT"] = "POWER_EFFECT";
    GameEffects["ATTACK_EFFECT"] = "ATTACK_EFFECT";
    GameEffects["KNOCK_OUT_EFFECT"] = "KNOCK_OUT_EFFECT";
    GameEffects["HEAL_EFFECT"] = "HEAL_EFFECT";
    GameEffects["EVOLVE_EFFECT"] = "EVOLVE_EFFECT";
    GameEffects["DRAW_PRIZES_EFFECT"] = "DRAW_PRIZES_EFFECT";
    GameEffects["MOVE_CARDS_EFFECT"] = "MOVE_CARDS_EFFECT";
    GameEffects["EFFECT_OF_ABILITY_EFFECT"] = "EFFECT_OF_ABILITY_EFFECT";
    GameEffects["SPECIAL_ENERGY_EFFECT"] = "SPECIAL_ENERGY_EFFECT";
    GameEffects["PUT_COUNTERS_EFFECT"] = "PUT_COUNTERS_EFFECT";
    GameEffects["PLACE_DAMAGE_COUNTERS_EFFECT"] = "PLACE_DAMAGE_COUNTERS_EFFECT";
    GameEffects["MOVE_DAMAGE_COUNTERS_EFFECT"] = "MOVE_DAMAGE_COUNTERS_EFFECT";
    GameEffects["MOVED_TO_ACTIVE_EFFECT"] = "MOVED_TO_ACTIVE_EFFECT";
})(GameEffects || (GameEffects = {}));
export class MovedToActiveEffect {
    constructor(player, pokemonCard) {
        this.type = GameEffects.MOVED_TO_ACTIVE_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.pokemonCard = pokemonCard;
    }
}
export class RetreatEffect {
    constructor(player, benchIndex) {
        this.type = GameEffects.RETREAT_EFFECT;
        this.preventDefault = false;
        this.ignoreStatusConditions = false;
        this.player = player;
        this.benchIndex = benchIndex;
        this.moveRetreatCostTo = player.discard;
    }
}
export class RetreatStartEffect {
    constructor(player) {
        this.type = GameEffects.RETREAT_START_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
export class UsePowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
export class UseTrainerPowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
export class UseEnergyPowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.USE_POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
export class PowerEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
export class TrainerPowerEffect {
    constructor(player, power, card) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
    }
}
export class UseAttackEffect {
    constructor(player, attack) {
        this.type = GameEffects.USE_ATTACK_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.attack = attack;
        this.source = player.active;
    }
}
export class UseStadiumEffect {
    constructor(player, stadium) {
        this.type = GameEffects.USE_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.stadium = stadium;
    }
}
export class AttackEffect {
    constructor(player, opponent, attack) {
        this.type = GameEffects.ATTACK_EFFECT;
        this.preventDefault = false;
        this.ignoreWeakness = false;
        this.ignoreResistance = false;
        this.invisibleTentacles = false;
        this.player = player;
        this.opponent = opponent;
        this.attack = attack;
        this.damage = attack.damage;
        this.source = player.active;
    }
}
// how many prizes when target Pokemon is KO
export class KnockOutEffect {
    constructor(player, target) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.isLostCity = false;
        this.prizeIncreased = false;
        this.player = player;
        this.target = target;
        this.prizeCount = 1;
    }
}
// how many prizes when target Pokemon is KO
export class KnockOutAttackEffect {
    constructor(player, target, attack) {
        this.type = GameEffects.KNOCK_OUT_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.attack = attack;
        this.prizeCount = 1;
    }
}
export class HealEffect {
    constructor(player, target, damage) {
        this.type = GameEffects.HEAL_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.damage = damage;
    }
}
export class EvolveEffect {
    constructor(player, target, pokemonCard) {
        this.type = GameEffects.EVOLVE_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.pokemonCard = pokemonCard;
        this.target.triggerEvolutionAnimation = true;
    }
}
export class DrawPrizesEffect {
    constructor(player, prizes, destination) {
        this.type = GameEffects.DRAW_PRIZES_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.prizes = prizes;
        this.destination = destination;
    }
}
export class MoveCardsEffect {
    constructor(source, destination, options = {}) {
        this.type = GameEffects.MOVE_CARDS_EFFECT;
        this.preventDefault = false;
        this.source = source;
        this.destination = destination;
        this.cards = options.cards;
        this.count = options.count;
        this.toTop = options.toTop;
        this.toBottom = options.toBottom;
        this.skipCleanup = options.skipCleanup;
        this.sourceCard = options.sourceCard;
        this.sourceEffect = options.sourceEffect;
    }
}
export class EffectOfAbilityEffect {
    constructor(player, power, card, target) {
        this.type = GameEffects.EFFECT_OF_ABILITY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
        this.target = target;
    }
}
export class SpecialEnergyEffect {
    constructor(player, card, attachedTo, exemptFromOpponentsSpecialEnergyBlockingAbility = false) {
        this.type = GameEffects.SPECIAL_ENERGY_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.card = card;
        this.attachedTo = attachedTo;
        this.exemptFromOpponentsSpecialEnergyBlockingAbility = exemptFromOpponentsSpecialEnergyBlockingAbility;
    }
}
export class PutDamageCountersEffect extends PowerEffect {
    constructor(base, damage) {
        super(base.player, base.power, base.card, base.target);
        this.type = GameEffects.PUT_COUNTERS_EFFECT;
        this.preventDefault = false;
        this.damage = damage;
        this.source = base.card;
        this.effectOfAbility = new EffectOfAbilityEffect(base.player, base.power, base.card, base.target);
    }
}
export class PlaceDamageCountersEffect {
    constructor(player, target, damage, source) {
        this.type = GameEffects.PLACE_DAMAGE_COUNTERS_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.target = target;
        this.damage = damage;
        this.source = source;
    }
}
export class MoveDamageCountersEffect {
    constructor(player) {
        this.type = GameEffects.MOVE_DAMAGE_COUNTERS_EFFECT;
        this.preventDefault = false;
        this.player = player;
    }
}
