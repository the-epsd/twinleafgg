import { Replay } from './replay';
import { ReplayActionRecord } from './replay.interface';
import { State } from '../store/state/state';
import { Store } from '../store/store';
import { StoreHandler } from '../store/store-handler';
export interface ReplayStateMismatch {
    actionSequence: number;
    stateIndex: number;
    expected: string;
    actual: string;
}
export interface ReplayValidationResult {
    ok: boolean;
    actionCount: number;
    checkedStateCount: number;
    mismatches: ReplayStateMismatch[];
    error?: string;
}
export interface ReplayActionReplayerOptions {
    initialState?: State;
    gameSettings?: any;
}
export declare class ReplayActionReplayer implements StoreHandler {
    readonly store: Store;
    private readonly serializer;
    constructor(options?: ReplayActionReplayerOptions);
    get state(): State;
    onStateChange(state: State): void;
    dispatchRecord(record: ReplayActionRecord): State;
    dispatchRecords(records: ReplayActionRecord[]): State;
    private applyGameSettings;
    private cloneState;
}
export declare function validateReplayActions(replay: Replay, options?: ReplayActionReplayerOptions): ReplayValidationResult;
