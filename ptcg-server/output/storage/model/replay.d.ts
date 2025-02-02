import { BaseEntity } from 'typeorm';
import { User } from './user';
import { GameWinner, ReplayPlayer } from '../../game';
export declare class Replay extends BaseEntity {
    id: number;
    user: User;
    name: string;
    player1: ReplayPlayer;
    player2: ReplayPlayer;
    winner: GameWinner;
    created: number;
    replayData: string;
}
