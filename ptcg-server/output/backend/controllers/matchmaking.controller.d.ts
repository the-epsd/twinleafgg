import { Request, Response } from 'express';
import { Controller } from './controller';
import { Server } from 'socket.io';
import { Core } from '../../game/core/core';
export declare class MatchmakingController extends Controller {
    private matchmakingService;
    private io;
    constructor(path: string, router: any, authMiddleware: any, validator: any, io: Server, core: Core);
    private setupWebSocket;
    joinQueue: (req: Request & {
        user?: {
            id: string;
        };
    }, res: Response) => Response<any> | undefined;
    leaveQueue: (req: Request & {
        user?: {
            id: string;
        };
    }, res: Response) => Response<any> | undefined;
}
