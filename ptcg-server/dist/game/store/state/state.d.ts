import { Player } from './player';
import { Prompt } from '../prompts/prompt';
import { StateLog } from './state-log';
import { Rules } from './rules';
import { Attack } from '../..';
export declare enum GamePhase {
    WAITING_FOR_PLAYERS = 0,
    SETUP = 1,
    PLAYER_TURN = 2,
    ATTACK = 3,
    BETWEEN_TURNS = 4,
    FINISHED = 5
}
export declare enum GameWinner {
    NONE = -1,
    PLAYER_1 = 0,
    PLAYER_2 = 1,
    DRAW = 3
}
export declare class State {
    cardNames: string[];
    logs: StateLog[];
    rules: Rules;
    prompts: Prompt<any>[];
    phase: GamePhase;
    turn: number;
    activePlayer: number;
    winner: GameWinner;
    players: Player[];
    skipOpponentTurn: boolean;
    lastAttack: Attack | null;
    playerLastAttack: {
        [playerId: number]: Attack;
    };
    isSuddenDeath?: boolean;
}
