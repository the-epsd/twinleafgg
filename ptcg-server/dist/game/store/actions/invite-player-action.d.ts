import { Action } from './action';
export declare class InvitePlayerAction implements Action {
    clientId: number;
    name: string;
    readonly type: string;
    constructor(clientId: number, name: string);
}
