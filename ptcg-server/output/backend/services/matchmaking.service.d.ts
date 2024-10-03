/// <reference types="node" />
import { EventEmitter } from 'events';
import { Core } from '../../game/core/core';
export declare class MatchmakingService {
    private lobbies;
    private playerFormat;
    queueUpdates: EventEmitter;
    private lobbyCache;
    private core;
    constructor(core: Core);
    getLobby(format: string): string[];
    addToQueue(userId: string, format: string): Promise<void>;
    removeFromQueue(userId: string): void;
    private checkForMatch;
    private emitLobbyUpdate;
    private createMatch;
}
