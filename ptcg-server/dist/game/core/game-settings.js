import { Rules } from '../store/state/rules';
export class GameSettings {
    constructor() {
        this.rules = new Rules();
        this.timeLimit = 900;
        this.recordingEnabled = true;
    }
}
