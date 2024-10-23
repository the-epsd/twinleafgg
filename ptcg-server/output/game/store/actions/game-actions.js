"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassTurnAction = exports.RetreatAction = exports.UseStadiumAction = exports.UseTrainerAbilityAction = exports.UseAbilityAction = exports.AttackAction = void 0;
class AttackAction {
    constructor(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'ATTACK_ACTION';
    }
}
exports.AttackAction = AttackAction;
class UseAbilityAction {
    constructor(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_ABILITY_ACTION';
    }
}
exports.UseAbilityAction = UseAbilityAction;
class UseTrainerAbilityAction {
    constructor(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_ABILITY_ACTION';
    }
}
exports.UseTrainerAbilityAction = UseTrainerAbilityAction;
class UseStadiumAction {
    constructor(clientId) {
        this.clientId = clientId;
        this.type = 'USE_STADIUM_ACTION';
    }
}
exports.UseStadiumAction = UseStadiumAction;
class RetreatAction {
    constructor(clientId, benchIndex) {
        this.clientId = clientId;
        this.benchIndex = benchIndex;
        this.type = 'RETREAT_ACTION';
    }
}
exports.RetreatAction = RetreatAction;
class PassTurnAction {
    constructor(clientId) {
        this.clientId = clientId;
        this.type = 'PASS_TURN';
    }
}
exports.PassTurnAction = PassTurnAction;
