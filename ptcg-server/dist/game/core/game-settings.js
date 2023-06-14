import { Rules } from '../store/state/rules';
export class GameSettings {
    constructor() {
        this.rules = new Rules();
        this.timeLimit = 1800;
        this.recordingEnabled = true;
    }
}
