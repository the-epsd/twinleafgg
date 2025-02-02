import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Message, User } from '../../storage';
import { SocketWrapper } from './socket-wrapper';
export declare class MessageSocket {
    private socket;
    private core;
    private client;
    constructor(client: Client, socket: SocketWrapper, core: Core);
    onMessage(from: Client, message: Message): void;
    onMessageRead(user: User): void;
    private sendMessage;
    private readMessages;
    private buildMessageInfo;
}
