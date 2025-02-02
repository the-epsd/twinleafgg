import { Action } from './action';
export declare enum PlayerType {
    ANY = 0,
    TOP_PLAYER = 1,
    BOTTOM_PLAYER = 2
}
export declare enum SlotType {
    BOARD = 0,
    ACTIVE = 1,
    BENCH = 2,
    HAND = 3,
    DISCARD = 4,
    LOSTZONE = 5
}
export interface CardTarget {
    player: PlayerType;
    slot: SlotType;
    index: number;
}
export declare class PlayCardAction implements Action {
    id: number;
    handIndex: number;
    target: CardTarget;
    readonly type: string;
    constructor(id: number, handIndex: number, target: CardTarget);
}
