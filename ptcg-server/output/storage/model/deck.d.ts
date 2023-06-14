import { BaseEntity } from 'typeorm';
import { User } from './user';
export declare class Deck extends BaseEntity {
    id: number;
    user: User;
    name: string;
    cards: string;
    isValid: boolean;
    cardTypes: string;
}
