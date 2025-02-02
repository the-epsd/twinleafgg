import { BaseEntity, EntityManager } from 'typeorm';
import { Conversation } from './conversation';
import { User } from './user';
export declare class Message extends BaseEntity {
    id: number;
    conversation: Conversation;
    sender: User;
    created: number;
    isRead: boolean;
    isDeletedByUser1: boolean;
    isDeletedByUser2: boolean;
    text: string;
    send(receiver: User, manager?: EntityManager): Promise<void>;
}
