import { Client } from '../../game/client/client.interface';
import { Core } from '../../game/core/core';
import { SocketWrapper } from './socket-wrapper';
import { Message } from '../../storage';
export declare class MatchmakingSocket {
    private client;
    private socket;
    private core;
    private matchmakingService;
    constructor(client: Client, socket: SocketWrapper, core: Core);
    onJoinQueue(from: Client, message: Message): void;
    onLeaveQueue(): void;
    private joinQueue;
    private leaveQueue;
    dispose(): void;
}
