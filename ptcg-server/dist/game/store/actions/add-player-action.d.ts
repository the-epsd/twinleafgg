import { Action } from './action';
export declare class AddPlayerAction implements Action {
    clientId: number;
    name: string;
    deck: string[];
    readonly type: string;
    constructor(clientId: number, name: string, deck: string[]);
}
