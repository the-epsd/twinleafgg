export class AttackAction {
    constructor(clientId, name) {
        this.clientId = clientId;
        this.name = name;
        this.type = 'ATTACK_ACTION';
    }
}
export class UseAbilityAction {
    constructor(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_ABILITY_ACTION';
    }
}
export class UseTrainerAbilityAction {
    constructor(clientId, name, target) {
        this.clientId = clientId;
        this.name = name;
        this.target = target;
        this.type = 'USE_ABILITY_ACTION';
    }
}
export class UseStadiumAction {
    constructor(clientId) {
        this.clientId = clientId;
        this.type = 'USE_STADIUM_ACTION';
    }
}
export class RetreatAction {
    constructor(clientId, benchIndex) {
        this.clientId = clientId;
        this.benchIndex = benchIndex;
        this.type = 'RETREAT_ACTION';
    }
}
export class PassTurnAction {
    constructor(clientId) {
        this.clientId = clientId;
        this.type = 'PASS_TURN';
    }
}
