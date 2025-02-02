import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { Message } from '../../storage';
import { SocketWrapper } from './socket-wrapper';
export declare class MatchmakingSocket {
    private socket;
    private core;
    private client;
    private matchmakingService;
    constructor(client: Client, socket: SocketWrapper, core: Core);
    onJoinQueue(from: Client, message: Message): void;
    onLeaveQueue(): void;
    private joinQueue;
    private leaveQueue;
    private buildMessageInfo;
}
