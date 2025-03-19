import { Core } from './core';
import { State } from '../store/state/state';
export declare class MatchRecorder {
    private core;
    private finished;
    private client1;
    private client2;
    private ranking;
    private replay;
    private transactionTimeout;
    private readonly TRANSACTION_TIMEOUT_MS;
    constructor(core: Core);
    onStateChange(state: State): void;
    private saveMatch;
    cleanup(): void;
    private updateClients;
    private findClient;
    private buildReplayPlayer;
}
