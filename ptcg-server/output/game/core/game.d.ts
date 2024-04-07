import { Action } from '../store/actions/action';
import { Client } from '../client/client.interface';
import { Core } from './core';
import { GameSettings } from './game-settings';
import { PlayerStats } from './player-stats';
import { State } from '../store/state/state';
import { StoreHandler } from '../store/store-handler';
import { Format } from '../store/card/card-types';
export declare class Game implements StoreHandler {
    private core;
    gameSettings: GameSettings;
    private readonly maxInvalidMoves;
    id: number;
    clients: Client[];
    playerStats: PlayerStats[];
    private arbiter;
    private store;
    private matchRecorder;
    private timeoutRef;
    format: Format;
    constructor(core: Core, id: number, gameSettings: GameSettings);
    get state(): State;
    onStateChange(state: State): void;
    private handleArbiterPrompts;
    dispatch(client: Client, action: Action): State;
    handleClientLeave(client: Client): void;
    private updateInvalidMoves;
    private updateIsTimeRunning;
    /**
     * Returns playerIds that needs to make a move.
     * Used to calculate their time left.
     */
    private getTimeRunningPlayers;
    private startTimer;
    private stopTimer;
}
