import { Format } from '../../game';
import { Core } from '../../game/core/core';
import { Client } from '../../game/client/client.interface';
import { SocketWrapper } from '../socket/socket-wrapper';
export declare class MatchmakingService {
    private core;
    private static instance;
    private queue;
    private matchCheckInterval;
    private constructor();
    static getInstance(core: Core): MatchmakingService;
    addToQueue(client: Client, socketWrapper: SocketWrapper, format: Format, deck: string[]): void;
    removeFromQueue(client: Client): void;
    getQueuedPlayers(): string[];
    private broadcastQueueUpdate;
    private checkMatches;
    dispose(): void;
}
