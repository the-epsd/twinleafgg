export var GameEffects;
(function (GameEffects) {
    GameEffects["RETREAT_EFFECT"] = "RETREAT_EFFECT";
    GameEffects["USE_ATTACK_EFFECT"] = "USE_ATTACK_EFFECT";
    GameEffects["USE_STADIUM_EFFECT"] = "USE_STADIUM_EFFECT";
    GameEffects["USE_POWER_EFFECT"] = "USE_POWER_EFFECT";
    GameEffects["POWER_EFFECT"] = "POWER_EFFECT";
    GameEffects["ATTACK_EFFECT"] = "ATTACK_EFFECT";
    GameEffects["KNOCK_OUT_EFFECT"] = "KNOCK_OUT_EFFECT";
    GameEffects["HEAL_EFFECT"] = "HEAL_EFFECT";
    GameEffects["EVOLVE_EFFECT"] = "EVOLVE_EFFECT";
})(GameEffects || (GameEffects = {}));
export class RetreatEffect {
    constructor(player, benchIndex) {
        this.type = GameEffects.RETREAT_EFFECT;
        this.preventDefault = false;
        this.ignoreStatusConditions = false;
        this.player = player;
        this.benchIndex = benchIndex;
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
export class PowerEffect {
    constructor(player, power, card) {
        this.type = GameEffects.POWER_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.power = power;
        this.card = card;
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
export class useToolEffect {
    constructor(player, tool) {
        this.type = GameEffects.USE_STADIUM_EFFECT;
        this.preventDefault = false;
        this.player = player;
        this.tool = tool;
    }
}
export class AttackEffect {
    constructor(player, opponent, attack) {
        this.type = GameEffects.ATTACK_EFFECT;
        this.preventDefault = false;
        this.ignoreWeakness = false;
        this.ignoreResistance = false;
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
    }
}
