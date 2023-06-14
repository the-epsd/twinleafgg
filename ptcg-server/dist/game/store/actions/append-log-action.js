export class AppendLogAction {
    constructor(id, message, params) {
        this.id = id;
        this.message = message;
        this.params = params;
        this.type = 'APPEND_LOG_ACTION';
    }
}
