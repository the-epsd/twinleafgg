import { Action } from './action';
import { StateLog } from '../state/state-log';
export declare class ChangeAvatarAction implements Action {
    id: number;
    avatarName: string;
    log?: StateLog | undefined;
    readonly type: string;
    constructor(id: number, avatarName: string, log?: StateLog | undefined);
}
