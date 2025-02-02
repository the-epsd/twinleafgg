import { Format } from '../store/card/card-types';
import { Rules } from '../store/state/rules';
export class GameSettings {
    constructor() {
        this.rules = new Rules();
        this.timeLimit = 900;
        this.recordingEnabled = true;
        this.format = Format.STANDARD;
    }
}
