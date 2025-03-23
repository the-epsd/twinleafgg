"use strict";
exports.__esModule = true;
exports.PassTurnAction = exports.RetreatAction = exports.UseStadiumAction = exports.UseTrainerAbilityAction = exports.UseAbilityAction = exports.AttackAction = void 0;
var AttackAction = /** @class */ (function () {
    function AttackAction(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'ATTACK_ACTION';
    }
    return AttackAction;
}());
exports.AttackAction = AttackAction;
var UseAbilityAction = /** @class */ (function () {
    function UseAbilityAction(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_ABILITY_ACTION';
    }
    return UseAbilityAction;
}());
exports.UseAbilityAction = UseAbilityAction;
var UseTrainerAbilityAction = /** @class */ (function () {
    function UseTrainerAbilityAction(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_TRAINER_ABILITY_ACTION';
    }
    return UseTrainerAbilityAction;
}());
exports.UseTrainerAbilityAction = UseTrainerAbilityAction;
var UseStadiumAction = /** @class */ (function () {
    function UseStadiumAction(clientId) {
        this.clientId = clientId;
        this.type = 'USE_STADIUM_ACTION';
    }
    return UseStadiumAction;
}());
exports.UseStadiumAction = UseStadiumAction;
var RetreatAction = /** @class */ (function () {
    function RetreatAction(clientId, benchIndex) {
        this.clientId = clientId;
        this.benchIndex = benchIndex;
        this.type = 'RETREAT_ACTION';
    }
    return RetreatAction;
}());
exports.RetreatAction = RetreatAction;
var PassTurnAction = /** @class */ (function () {
    function PassTurnAction(clientId) {
        this.clientId = clientId;
        this.type = 'PASS_TURN';
    }
    return PassTurnAction;
}());
exports.PassTurnAction = PassTurnAction;
