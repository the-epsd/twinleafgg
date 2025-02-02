import { BaseEntity } from 'typeorm';
import { Message } from './message';
import { User } from './user';
export declare class Conversation extends BaseEntity {
    id: number;
    user1: User;
    user2: User;
    messages: Message[];
    lastMessage: Message;
    static findByUsers(user1: User, user2: User): Promise<Conversation>;
}
