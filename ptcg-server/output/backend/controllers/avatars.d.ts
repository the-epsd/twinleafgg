import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Avatars extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onFind(req: Request, res: Response): Promise<void>;
    onAdd(res: Response): Promise<void>;
    onDelete(res: Response): Promise<void>;
    onRename(res: Response): Promise<void>;
    onMarkAsDefault(res: Response): Promise<void>;
}
