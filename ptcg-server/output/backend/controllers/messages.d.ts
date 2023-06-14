import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Messages extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onDeleteMessages(req: Request, res: Response): Promise<void>;
}
