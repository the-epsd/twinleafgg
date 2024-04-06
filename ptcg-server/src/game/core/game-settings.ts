import { Format } from '../store/card/card-types';
import { Rules } from '../store/state/rules';

export class GameSettings {

  rules: Rules = new Rules();

  timeLimit: number = 900;

  recordingEnabled: boolean = true;

  format: Format = Format.STANDARD;

}
