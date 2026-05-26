export class GameError {
    constructor(code, message) {
        this.message = message || code;
    }
}
