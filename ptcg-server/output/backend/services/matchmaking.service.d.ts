import { Format } from '../../game';
import { Core } from '../../game/core/core';
import { Client } from '../../game/client/client.interface';
import { SocketWrapper } from '../socket/socket-wrapper';
export declare class MatchmakingService {
    private core;
    private static instance;
    private queue;
    private matchCheckInterval;
    private validateInterval;
    private readonly CHECK_INTERVAL;
    private readonly VALIDATE_INTERVAL;
    private readonly MAX_QUEUE_TIME;
    private constructor();
    static getInstance(core: Core): MatchmakingService;
    addToQueue(client: Client, socketWrapper: SocketWrapper, format: Format, deck: string[]): void;
    removeFromQueue(client: Client): void;
    getQueuedPlayers(): string[];
    isPlayerInQueue(client: Client): boolean;
    private broadcastQueueUpdate;
    private validateQueue;
    private checkMatches;
    dispose(): void;
}
