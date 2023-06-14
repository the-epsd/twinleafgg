"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttackTactic = void 0;
const game_1 = require("../../game");
const simple_tactics_1 = require("./simple-tactics");
class AttackTactic extends simple_tactics_1.SimpleTactic {
    useTactic(state, player) {
        const sp = player.active.specialConditions;
        if (sp.includes(game_1.SpecialCondition.PARALYZED) || sp.includes(game_1.SpecialCondition.ASLEEP)) {
            return undefined;
        }
        const active = player.active.getPokemonCard();
        if (!active) {
            return undefined;
        }
        const attackBonus = this.options.scores.tactics.attackBonus;
        let bestScore = this.getStateScore(state, player.id) - attackBonus;
        let attackAction;
        active.attacks.forEach(attack => {
            const action = new game_1.AttackAction(player.id, attack.name);
            const score = this.evaluateAction(state, player.id, action);
            if (score !== undefined && bestScore < score) {
                bestScore = score;
                attackAction = action;
            }
        });
        return attackAction;
    }
}
exports.AttackTactic = AttackTactic;
