import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Avatars extends Controller {
    onGetPredefined(req: Request, res: Response): Promise<void>;
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
    onMarkAsDefault(req: Request, res: Response): Promise<void>;
}
