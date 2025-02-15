import { Client } from '../../game/client/client.interface';
import { SocketCache } from './socket-cache';
import { State } from '../../game/store/state/state';
export declare class StateSanitizer {
    private client;
    private cache;
    constructor(client: Client, cache: SocketCache);
    /**
     * Clear sensitive data, resolved prompts and old logs.
     */
    sanitize(state: State, gameId: number): State;
    private hideSecretCards;
    private createUnknownCard;
    private getSecretCardLists;
    private filterPrompts;
    private removeLogs;
}
