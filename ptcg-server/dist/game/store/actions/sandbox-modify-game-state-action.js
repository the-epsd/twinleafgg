export class SandboxModifyGameStateAction {
    constructor(clientId, modifications) {
        this.clientId = clientId;
        this.modifications = modifications;
        this.type = 'SANDBOX_MODIFY_GAME_STATE';
    }
}
