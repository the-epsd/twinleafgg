import { State, GameWinner } from '../store/state/state';
import { ReplayPlayer, ReplayOptions } from './replay.interface';
export declare class Replay {
    private readonly indexJumpSize;
    player1: ReplayPlayer;
    player2: ReplayPlayer;
    winner: GameWinner;
    created: number;
    private turnMap;
    private diffs;
    private indexes;
    private prevState;
    private serializer;
    private options;
    constructor(options?: Partial<ReplayOptions>);
    getStateCount(): number;
    getState(position: number): State;
    getTurnCount(): number;
    getTurnPosition(turn: number): number;
    setCreated(created: number): void;
    appendState(state: State): void;
    serialize(): string;
    deserialize(replayData: string): void;
    private swapQuotes;
    private compress;
    private decompress;
    private rebuildIndex;
    private indexJumps;
}
