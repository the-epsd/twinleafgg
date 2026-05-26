export class SandboxModifyPlayerAction {
    constructor(clientId, targetPlayerId, modifications) {
        this.clientId = clientId;
        this.targetPlayerId = targetPlayerId;
        this.modifications = modifications;
        this.type = 'SANDBOX_MODIFY_PLAYER';
    }
}
