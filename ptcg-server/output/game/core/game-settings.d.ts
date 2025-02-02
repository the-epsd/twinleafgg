import { Format } from '../store/card/card-types';
import { Rules } from '../store/state/rules';
export declare class GameSettings {
    rules: Rules;
    timeLimit: number;
    recordingEnabled: boolean;
    format: Format;
}
