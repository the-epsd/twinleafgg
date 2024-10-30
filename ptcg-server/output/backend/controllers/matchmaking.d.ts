import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Matchmaking extends Controller {
    joinQueue(req: Request, res: Response): Response<any> | undefined;
    leaveQueue(req: Request, res: Response): Response<any> | undefined;
}
