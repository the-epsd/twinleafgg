import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Ranking extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
}
