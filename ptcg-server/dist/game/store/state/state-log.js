export class StateLog {
    constructor(message, params = {}, client = 0) {
        this.id = 0;
        this.message = message;
        this.params = params;
        this.client = client;
    }
}
