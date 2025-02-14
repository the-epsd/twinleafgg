import { Client } from '../../game/client/client.interface';
import { SocketCache } from './socket-cache';
import { State } from '../../game/store/state/state';
export declare class StateSanitizer {
    private client;
    private cache;
    private lastSanitizedState;
    private lastSanitizedTime;
    private readonly SANITIZE_INTERVAL;
    constructor(client: Client, cache: SocketCache);
    /**
     * Clear sensitive data, resolved prompts and old logs.
     * Returns cached sanitized state if called within SANITIZE_INTERVAL
     */
    sanitize(state: State, gameId: number): State;
    private hideSecretCards;
    private createUnknownCard;
    private getSecretCardLists;
    private filterPrompts;
    private removeLogs;
}
