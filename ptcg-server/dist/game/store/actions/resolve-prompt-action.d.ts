import { Action } from './action';
import { StateLog } from '../state/state-log';
export declare class ResolvePromptAction implements Action {
    id: number;
    result: any;
    log?: StateLog | undefined;
    encodedResult?: any;
    readonly type: string;
    constructor(id: number, result: any, log?: StateLog | undefined, encodedResult?: any);
}
