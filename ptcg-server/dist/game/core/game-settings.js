import { Format } from '../store/card/card-types';
import { Rules } from '../store/state/rules';
export class GameSettings {
    constructor() {
        this.rules = new Rules();
        this.timeLimit = 1200;
        this.recordingEnabled = true;
        this.format = Format.STANDARD;
        this.sandboxMode = false;
    }
}
