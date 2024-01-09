export class Prompt {
    constructor(playerId) {
        this.playerId = playerId;
        this.id = 0;
    }
    decode(result, state) {
        return result;
    }
    validate(result, state) {
        return true;
    }
}
