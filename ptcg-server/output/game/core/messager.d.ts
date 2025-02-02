import { Client } from '../client/client.interface';
import { Core } from './core';
import { User, Message } from '../../storage';
export declare class Messager {
    private core;
    constructor(core: Core);
    sendMessage(client: Client, receiver: User, text: string): Promise<Message>;
    readMessages(client: Client, conversationUser: User): Promise<void>;
}
