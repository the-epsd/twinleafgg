import { Action } from '../store/actions/action';
import { State } from '../store/state/state';
import { ReplayActionRecord } from './replay.interface';
export declare function buildReplayActionPayload(action: Action): any;
export declare function buildActionFromReplayRecord(record: ReplayActionRecord, state?: State): Action;
