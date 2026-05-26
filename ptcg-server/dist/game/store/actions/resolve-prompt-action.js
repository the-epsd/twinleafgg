export class ResolvePromptAction {
    constructor(id, result, log, encodedResult) {
        this.id = id;
        this.result = result;
        this.log = log;
        this.encodedResult = encodedResult;
        this.type = 'RESOLVE_PROMPT';
    }
}
