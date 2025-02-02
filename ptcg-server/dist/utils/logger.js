import { config } from '../config';
export class Logger {
    log(message) {
        if (!config.core.debug) {
            return;
        }
        console.log(message);
    }
}
export const logger = new Logger();
