import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Message } from '../../storage';
import { SocketWrapper } from './socket-wrapper';
export declare class MatchmakingSocket {
    private socket;
    private core;
    private client;
    private matchmakingService;
    private boundJoinQueue;
    private boundLeaveQueue;
    constructor(client: Client, socket: SocketWrapper, core: Core);
    private bindListeners;
    onJoinQueue(from: Client, message: Message): void;
    onLeaveQueue(from: Client): void;
    private joinQueue;
    private leaveQueue;
    destroy(): void;
    private buildMessageInfo;
}
