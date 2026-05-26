import { StateScore } from '../state-score/state-score';
export class PromptResolver {
    constructor(options) {
        this.options = options;
        this.stateScore = new StateScore(this.options);
    }
    getStateScore(state, playerId) {
        return this.stateScore.getScore(state, playerId);
    }
}
