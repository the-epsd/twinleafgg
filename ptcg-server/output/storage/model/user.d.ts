import { BaseEntity } from 'typeorm';
import { Avatar } from './avatar';
import { Deck } from './deck';
import { Replay } from './replay';
import { Rank } from '../../backend/interfaces/rank.enum';
export declare class User extends BaseEntity {
    id: number;
    name: string;
    email: string;
    ranking: number;
    password: string;
    registered: number;
    lastSeen: number;
    lastRankingChange: number;
    avatarFile: string;
    decks: Deck[];
    avatars: Avatar[];
    replays: Replay[];
    getRank(): Rank;
    updateLastSeen(): Promise<this>;
}
