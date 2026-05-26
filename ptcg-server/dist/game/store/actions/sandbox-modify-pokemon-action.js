export class SandboxModifyPokemonAction {
    constructor(clientId, targetPlayerId, location, modifications, benchIndex) {
        this.clientId = clientId;
        this.targetPlayerId = targetPlayerId;
        this.location = location;
        this.modifications = modifications;
        this.benchIndex = benchIndex;
        this.type = 'SANDBOX_MODIFY_POKEMON';
    }
}
