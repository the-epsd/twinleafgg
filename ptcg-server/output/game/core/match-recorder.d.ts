import { Core } from './core';
import { State } from '../store/state/state';
export declare class MatchRecorder {
    private core;
    private finished;
    private client1;
    private client2;
    private ranking;
    private replay;
    constructor(core: Core);
    onStateChange(state: State): void;
    private saveMatch;
    private updateClients;
    private findClient;
    private buildReplayPlayer;
}
