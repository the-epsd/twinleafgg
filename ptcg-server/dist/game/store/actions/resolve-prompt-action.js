export class ResolvePromptAction {
    constructor(id, result, log) {
        this.id = id;
        this.result = result;
        this.log = log;
        this.type = 'RESOLVE_PROMPT';
    }
}
