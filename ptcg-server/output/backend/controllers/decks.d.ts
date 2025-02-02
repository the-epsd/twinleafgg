import { Request, Response } from 'express';
import { Controller } from './controller';
export declare class Decks extends Controller {
    onList(req: Request, res: Response): Promise<void>;
    onGet(req: Request, res: Response): Promise<void>;
    onSave(req: Request, res: Response): Promise<void>;
    onDelete(req: Request, res: Response): Promise<void>;
    onRename(req: Request, res: Response): Promise<void>;
    onDuplicate(req: Request, res: Response): Promise<void>;
    private validateCards;
}
