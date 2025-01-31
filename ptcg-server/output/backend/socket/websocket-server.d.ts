/// <reference types="node" />
import * as http from 'http';
import { Server, Socket } from 'socket.io';
import { Core } from '../../game/core/core';
export declare type Middleware = (socket: Socket, next: (err?: any) => void) => void;
export declare class WebSocketServer {
    private core;
    server: Server | undefined;
    constructor(core: Core);
    listen(httpServer: http.Server): Promise<void>;
}
